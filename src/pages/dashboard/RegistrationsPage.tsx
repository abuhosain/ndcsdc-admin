import { useEffect, useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { registrationsApi, summitApi } from "../../services/api";

interface RegistrationItem {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email?: string | null;
  institution: string;
  hscBatch: number | string;
  group: string;
  trackId?: string;
  track?: { name: string; stream: string } | string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

const INITIAL_DATA: RegistrationItem[] = [
  { id: "1", code: "NACS26-00482", fullName: "Md. Tanvir Ahmed", phone: "01711234567", email: "tanvir.ndc@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: 2026, group: "SCIENCE", track: "BUET", status: "CONFIRMED", createdAt: "2026-10-08 14:32" },
  { id: "2", code: "NACS26-00483", fullName: "Farhan Tanvir", phone: "01812345678", email: "farhan.tanvir@gmail.com", institution: "Dhaka City College", hscBatch: 2026, group: "COMMERCE", track: "IBA", status: "CONFIRMED", createdAt: "2026-10-08 14:45" },
  { id: "3", code: "NACS26-00484", fullName: "Samiha Anjum", phone: "01913456789", email: "samiha.anjum@gmail.com", institution: "Holy Cross College", hscBatch: 2026, group: "SCIENCE", track: "MEDICAL", status: "CONFIRMED", createdAt: "2026-10-08 15:10" },
  { id: "4", code: "NACS26-00485", fullName: "Abrar Fahim", phone: "01614567890", email: "abrar.fahim@gmail.com", institution: "Rajuk Uttara Model College", hscBatch: 2027, group: "SCIENCE", track: "ABROAD", status: "CONFIRMED", createdAt: "2026-10-08 15:30" },
  { id: "5", code: "NACS26-00486", fullName: "Nafis Imtiaz", phone: "01722334455", email: "nafis.imtiaz@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: 2026, group: "SCIENCE", track: "BUET", status: "CONFIRMED", createdAt: "2026-10-08 16:05" },
];

export default function RegistrationsPage() {
  const [data, setData] = useState<RegistrationItem[]>(INITIAL_DATA);
  const [tracks, setTracks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("ALL");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<RegistrationItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoster = async () => {
    try {
      setLoading(true);
      const [rosterRes, tracksRes] = await Promise.allSettled([
        registrationsApi.getRoster({
          search: search.trim() || undefined,
          trackId: trackFilter !== "ALL" ? trackFilter : undefined,
          group: groupFilter !== "ALL" ? groupFilter : undefined,
          limit: 100,
        }),
        summitApi.getTracks(),
      ]);

      if (rosterRes.status === "fulfilled" && rosterRes.value.data && rosterRes.value.data.length > 0) {
        setData(rosterRes.value.data);
      }
      if (tracksRes.status === "fulfilled" && tracksRes.value.data && tracksRes.value.data.length > 0) {
        setTracks(tracksRes.value.data);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [trackFilter, groupFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoster();
  };

  const getTrackDisplayName = (item: RegistrationItem) => {
    if (typeof item.track === "object" && item.track?.name) return item.track.name;
    if (typeof item.track === "string") return item.track;
    return "Track";
  };

  const filteredData = data.filter((item) => {
    const trackName = getTrackDisplayName(item).toUpperCase();
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === "ALL" || item.trackId === trackFilter || trackName.includes(trackFilter);
    const matchesGroup = groupFilter === "ALL" || item.group === groupFilter;

    return matchesSearch && matchesTrack && matchesGroup;
  });

  const handleExportCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,Code,FullName,Phone,Email,Institution,HSCBatch,Group,Track,Status,CreatedAt\n";

    filteredData.forEach((row) => {
      const trackName = getTrackDisplayName(row);
      csvContent += `"${row.code}","${row.fullName}","${row.phone}","${row.email || ""}","${row.institution}","${row.hscBatch}","${row.group}","${trackName}","${row.status}","${row.createdAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NACS26_Registrations_${trackFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredData.length} records to CSV.`);
  };

  const toggleStatus = async (item: RegistrationItem) => {
    const nextStatus = item.status === "CONFIRMED" ? "CANCELLED" : "CONFIRMED";
    try {
      await registrationsApi.updateStatus(item.id, nextStatus);
      setData((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r))
      );
      toast.success(`Status updated to ${nextStatus}.`);
    } catch {
      // Local optimistic update
      setData((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r))
      );
      toast.success(`Status updated to ${nextStatus} (Local).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Student Registrations Roster
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Total {filteredData.length} filtered records &bull; Verified attendance passes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRoster}
            className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#D5CEBC] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E685E] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, phone, code or college…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F1E6] border border-[#D5CEBC] rounded-lg text-xs text-[#1A1614] focus:outline-none focus:border-[#A81818]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-semibold text-[#1A1614] cursor-pointer"
          >
            <option value="ALL">All Summit Tracks</option>
            {tracks.length > 0 ? (
              tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))
            ) : (
              <>
                <option value="BUET">BUET Track</option>
                <option value="IBA">IBA Track</option>
                <option value="MEDICAL">Medical Track</option>
                <option value="ABROAD">Abroad Track</option>
              </>
            )}
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-semibold text-[#1A1614] cursor-pointer"
          >
            <option value="ALL">All Streams</option>
            <option value="SCIENCE">Science Group</option>
            <option value="COMMERCE">Commerce Group</option>
            <option value="ARTS">Humanities Group</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase tracking-wider">
                <th className="p-3.5 border-b border-[#D5CEBC]">Pass Code</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Full Name</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Phone</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">College / School</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Stream & Batch</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Selected Track</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
                <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#6E685E]">
                    No registration records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F5F1E6] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#A81818]">{row.code}</td>
                    <td className="p-3.5 font-bold text-[#1A1614]">{row.fullName}</td>
                    <td className="p-3.5 font-mono text-[#6E685E]">{row.phone}</td>
                    <td className="p-3.5 text-[#4A4540] max-w-[180px] truncate">{row.institution}</td>
                    <td className="p-3.5 text-[#6E685E]">
                      Batch {row.hscBatch} &bull; <span className="font-semibold">{row.group}</span>
                    </td>
                    <td className="p-3.5 font-bold uppercase text-[#1A1614]">
                      {getTrackDisplayName(row)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedItem(row)}
                        title="View Full Pass"
                        className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(row)}
                        title={row.status === "CONFIRMED" ? "Mark as Cancelled" : "Confirm Pass"}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          row.status === "CONFIRMED"
                            ? "text-emerald-700 hover:text-rose-700 hover:bg-rose-50"
                            : "text-rose-700 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {row.status === "CONFIRMED" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View Pass Detail */}
      <Modal
        open={Boolean(selectedItem)}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        centered
        title={<span className="font-display font-bold uppercase text-sm">Official Voucher Pass Detail</span>}
      >
        {selectedItem && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="bg-[#1A1614] text-white p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E8C547] block">Voucher Pass Code</span>
                <span className="font-mono font-black text-xl text-white">{selectedItem.code}</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                selectedItem.status === "CONFIRMED" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}>
                {selectedItem.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F1E6] rounded-lg border border-[#D5CEBC]">
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Student Name</span>
                <span className="font-bold text-[#1A1614] text-sm">{selectedItem.fullName}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Mobile Phone</span>
                <span className="font-mono font-bold text-[#1A1614] text-sm">{selectedItem.phone}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Institution</span>
                <span className="font-semibold text-[#1A1614]">{selectedItem.institution}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Batch & Group</span>
                <span className="font-semibold text-[#1A1614]">HSC {selectedItem.hscBatch} &bull; {selectedItem.group}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Assigned Pathway</span>
                <span className="font-bold text-[#A81818] uppercase">{getTrackDisplayName(selectedItem)}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Email</span>
                <span className="text-[#1A1614]">{selectedItem.email || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  toggleStatus(selectedItem);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-[#A81818] text-white font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer"
              >
                Toggle Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
