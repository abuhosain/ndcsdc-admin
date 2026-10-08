import { useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface RegistrationItem {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email: string;
  institution: string;
  hscBatch: string;
  group: string;
  track: string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

const INITIAL_DATA: RegistrationItem[] = [
  { id: "1", code: "NACS26-00482", fullName: "Md. Tanvir Ahmed", phone: "01711234567", email: "tanvir.ndc@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: "2026", group: "SCIENCE", track: "BUET", status: "CONFIRMED", createdAt: "2026-10-08 14:32" },
  { id: "2", code: "NACS26-00483", fullName: "Farhan Tanvir", phone: "01812345678", email: "farhan.tanvir@gmail.com", institution: "Dhaka City College", hscBatch: "2026", group: "COMMERCE", track: "IBA", status: "CONFIRMED", createdAt: "2026-10-08 14:45" },
  { id: "3", code: "NACS26-00484", fullName: "Samiha Anjum", phone: "01913456789", email: "samiha.anjum@gmail.com", institution: "Holy Cross College", hscBatch: "2026", group: "SCIENCE", track: "MEDICAL", status: "CONFIRMED", createdAt: "2026-10-08 15:10" },
  { id: "4", code: "NACS26-00485", fullName: "Abrar Fahim", phone: "01614567890", email: "abrar.fahim@gmail.com", institution: "Rajuk Uttara Model College", hscBatch: "2027", group: "SCIENCE", track: "ABROAD", status: "CONFIRMED", createdAt: "2026-10-08 15:30" },
  { id: "5", code: "NACS26-00486", fullName: "Nafis Imtiaz", phone: "01722334455", email: "nafis.imtiaz@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: "2026", group: "SCIENCE", track: "BUET", status: "CONFIRMED", createdAt: "2026-10-08 16:05" },
  { id: "6", code: "NACS26-00487", fullName: "Zannatul Ferdous", phone: "01833445566", email: "zannat.ferdous@gmail.com", institution: "Viqarunnisa Noon College", hscBatch: "2026", group: "COMMERCE", track: "IBA", status: "CONFIRMED", createdAt: "2026-10-08 16:40" },
  { id: "7", code: "NACS26-00488", fullName: "Kazi Tahsin", phone: "01944556677", email: "kazi.tahsin@gmail.com", institution: "Dhaka College", hscBatch: "2026", group: "SCIENCE", track: "MEDICAL", status: "CONFIRMED", createdAt: "2026-10-08 17:15" },
];

export default function RegistrationsPage() {
  const [data, setData] = useState<RegistrationItem[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("ALL");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<RegistrationItem | null>(null);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase());

    const matchesTrack = trackFilter === "ALL" || item.track === trackFilter;
    const matchesGroup = groupFilter === "ALL" || item.group === groupFilter;

    return matchesSearch && matchesTrack && matchesGroup;
  });

  const handleExportCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,Code,FullName,Phone,Email,Institution,HSCBatch,Group,Track,Status,CreatedAt\n";

    filteredData.forEach((row) => {
      csvContent += `"${row.code}","${row.fullName}","${row.phone}","${row.email}","${row.institution}","${row.hscBatch}","${row.group}","${row.track}","${row.status}","${row.createdAt}"\n`;
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

  const toggleStatus = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "CONFIRMED" ? "CANCELLED" : "CONFIRMED" }
          : item
      )
    );
    toast.success("Registration status updated.");
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

        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D5CEBC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6E685E] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by code, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-[#D5CEBC] bg-[#F5F1E6] focus:outline-none focus:border-[#A81818]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#D5CEBC] bg-white cursor-pointer"
            >
              <option value="ALL">All Pathways</option>
              <option value="BUET">BUET Track</option>
              <option value="IBA">IBA Track</option>
              <option value="MEDICAL">Medical Track</option>
              <option value="ABROAD">Abroad & IELTS</option>
            </select>
          </div>

          <div>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-[#D5CEBC] bg-white cursor-pointer"
            >
              <option value="ALL">All Streams</option>
              <option value="SCIENCE">Science</option>
              <option value="COMMERCE">Commerce</option>
              <option value="ARTS">Arts</option>
            </select>
          </div>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3.5 border-b border-[#D5CEBC]">Pass Code</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Student Name</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Phone</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Institution</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Stream & Batch</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Track</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
                <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#A81818]">{row.code}</td>
                  <td className="p-3.5 font-semibold text-[#1A1614]">{row.fullName}</td>
                  <td className="p-3.5 font-mono text-[#6E685E]">{row.phone}</td>
                  <td className="p-3.5 text-[#4A4540]">{row.institution}</td>
                  <td className="p-3.5 text-[#6E685E]">{row.group} &bull; '26</td>
                  <td className="p-3.5 font-bold uppercase text-[#1A1614]">{row.track}</td>
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
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem(row)}
                        className="p-1.5 hover:bg-[#EFEADB] rounded text-[#1A1614] cursor-pointer"
                        title="View Pass Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStatus(row.id)}
                        className={`p-1.5 hover:bg-[#EFEADB] rounded cursor-pointer ${
                          row.status === "CONFIRMED" ? "text-amber-700" : "text-emerald-700"
                        }`}
                        title={row.status === "CONFIRMED" ? "Mark Cancelled" : "Re-Confirm"}
                      >
                        {row.status === "CONFIRMED" ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#6E685E]">
                    No student registrations found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Registration Pass Details
          </span>
        }
      >
        {selectedItem && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-[#F5F1E6] rounded border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#6E685E] block">Pass Voucher Code</span>
                <span className="font-mono font-bold text-lg text-[#A81818]">{selectedItem.code}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                {selectedItem.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#6E685E] block font-bold">Full Name</span>
                <span className="font-semibold text-[#1A1614]">{selectedItem.fullName}</span>
              </div>
              <div>
                <span className="text-[#6E685E] block font-bold">Contact Phone</span>
                <span className="font-mono text-[#1A1614]">{selectedItem.phone}</span>
              </div>
              <div>
                <span className="text-[#6E685E] block font-bold">Email Address</span>
                <span className="text-[#1A1614]">{selectedItem.email}</span>
              </div>
              <div>
                <span className="text-[#6E685E] block font-bold">Institution</span>
                <span className="text-[#1A1614]">{selectedItem.institution}</span>
              </div>
              <div>
                <span className="text-[#6E685E] block font-bold">Batch & Stream</span>
                <span className="text-[#1A1614]">HSC {selectedItem.hscBatch} &bull; {selectedItem.group}</span>
              </div>
              <div>
                <span className="text-[#6E685E] block font-bold">Target Track</span>
                <span className="font-bold text-[#A81818] uppercase">{selectedItem.track} Track</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D5CEBC] flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-[#1A1614] text-white rounded text-xs font-bold uppercase"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
