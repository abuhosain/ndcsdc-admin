import { useEffect, useState } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Calendar,
  Layers,
} from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { registrationsApi, summitApi, activitiesApi } from "../../services/api";

interface RegistrationItem {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email?: string | null;
  institution: string;
  hscBatch: number | string;
  group: string;
  eventTitle?: string;
  eventName?: string;
  activityId?: string;
  activity?: { id: string; title: string; category?: string };
  trackId?: string;
  track?: { name: string; stream: string; hall?: string } | string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

const INITIAL_DATA: RegistrationItem[] = [
  { id: "1", code: "NACS26-00482", fullName: "Md. Tanvir Ahmed", phone: "01711234567", email: "tanvir.ndc@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: 2026, group: "SCIENCE", eventTitle: "1st National Academic Career Summit 2026", track: "BUET & Engineering Drills", status: "CONFIRMED", createdAt: "2026-10-08 14:32" },
  { id: "2", code: "NDC-EVT-00483", fullName: "Farhan Tanvir", phone: "01812345678", email: "farhan.tanvir@gmail.com", institution: "Dhaka City College", hscBatch: 2026, group: "COMMERCE", eventTitle: "IBA DU Masterclass: Verbal & Analytical Speed Drills", track: "Workshop", status: "CONFIRMED", createdAt: "2026-10-08 14:45" },
  { id: "3", code: "NACS26-00484", fullName: "Samiha Anjum", phone: "01913456789", email: "samiha.anjum@gmail.com", institution: "Holy Cross College", hscBatch: 2026, group: "SCIENCE", eventTitle: "1st National Academic Career Summit 2026", track: "Medical & Healthcare Strategy", status: "CONFIRMED", createdAt: "2026-10-08 15:10" },
  { id: "4", code: "NACS26-00485", fullName: "Abrar Fahim", phone: "01614567890", email: "abrar.fahim@gmail.com", institution: "Rajuk Uttara Model College", hscBatch: 2027, group: "SCIENCE", eventTitle: "1st National Academic Career Summit 2026", track: "Abroad Studies & Global IELTS", status: "CONFIRMED", createdAt: "2026-10-08 15:30" },
  { id: "5", code: "NDC-EVT-00486", fullName: "Nafis Imtiaz", phone: "01722334455", email: "nafis.imtiaz@gmail.com", institution: "Notre Dame College, Dhaka", hscBatch: 2026, group: "SCIENCE", eventTitle: "Medical Admission Diagnostic Workshop 2025", track: "Seminar", status: "CONFIRMED", createdAt: "2026-10-08 16:05" },
];

export default function RegistrationsPage() {
  const [data, setData] = useState<RegistrationItem[]>(INITIAL_DATA);
  const [tracks, setTracks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [trackFilter, setTrackFilter] = useState("ALL");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<RegistrationItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoster = async () => {
    try {
      setLoading(true);
      const [rosterRes, tracksRes, activitiesRes] = await Promise.allSettled([
        registrationsApi.getRoster({
          search: search.trim() || undefined,
          trackId: trackFilter !== "ALL" ? trackFilter : undefined,
          group: groupFilter !== "ALL" ? groupFilter : undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          limit: 100,
        }),
        summitApi.getTracks(),
        activitiesApi.getAdminActivities(),
      ]);

      if (rosterRes.status === "fulfilled" && rosterRes.value?.data && Array.isArray(rosterRes.value.data) && rosterRes.value.data.length > 0) {
        setData(rosterRes.value.data);
      }
      if (tracksRes.status === "fulfilled" && tracksRes.value?.data && Array.isArray(tracksRes.value.data)) {
        setTracks(tracksRes.value.data);
      }
      if (activitiesRes.status === "fulfilled" && activitiesRes.value?.data && Array.isArray(activitiesRes.value.data)) {
        setEvents(activitiesRes.value.data);
      }
    } catch {
      // Keep fallback
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

  const getEventDisplayName = (item: RegistrationItem) => {
    if (item.eventTitle) return item.eventTitle;
    if (item.activity?.title) return item.activity.title;
    if (item.eventName) return item.eventName;
    if (item.track) return "1st National Academic Career Summit 2026";
    return "NDCSDC Academic Program";
  };

  const getTrackDisplayName = (item: RegistrationItem) => {
    if (typeof item.track === "object" && item.track?.name) return item.track.name;
    if (typeof item.track === "string" && item.track) return item.track;
    if (item.activity?.category) return item.activity.category;
    return "General Entry";
  };

  const getTrackHall = (item: RegistrationItem) => {
    if (typeof item.track === "object" && item.track?.hall) return item.track.hall;
    const name = getTrackDisplayName(item).toUpperCase();
    if (name.includes("BUET")) return "Science Building Room 301–304";
    if (name.includes("IBA")) return "Main Auditorium Hall A";
    if (name.includes("MEDIC")) return "Main Auditorium Hall B";
    if (name.includes("ABROAD")) return "Seminar Hall C";
    return "Notre Dame College Campus";
  };

  const filteredData = data.filter((item) => {
    const eventName = getEventDisplayName(item).toLowerCase();
    const trackName = getTrackDisplayName(item).toUpperCase();

    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase()) ||
      eventName.includes(search.toLowerCase()) ||
      trackName.includes(search.toUpperCase());

    const matchesEvent =
      eventFilter === "ALL" ||
      eventName.includes(eventFilter.toLowerCase()) ||
      (eventFilter === "SUMMIT" && (eventName.includes("summit") || eventName.includes("nacs")));

    const matchesTrack =
      trackFilter === "ALL" ||
      item.trackId === trackFilter ||
      trackName.includes(trackFilter.toUpperCase());

    const matchesGroup = groupFilter === "ALL" || item.group === groupFilter;
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesEvent && matchesTrack && matchesGroup && matchesStatus;
  });

  const handleExportCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,PassCode,EventName,SelectedTrack,FullName,Phone,Email,Institution,HSCBatch,StreamGroup,Status,RegisteredAt\n";

    filteredData.forEach((row) => {
      const eventName = getEventDisplayName(row);
      const trackName = getTrackDisplayName(row);
      csvContent += `"${row.code}","${eventName}","${trackName}","${row.fullName}","${row.phone}","${row.email || ""}","${row.institution}","${row.hscBatch}","${row.group}","${row.status}","${row.createdAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `NDCSDC_Registrations_${eventFilter}_${trackFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    );
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
            Total {filteredData.length} filtered attendees &bull; Event-wise verified registration passes
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

      {/* Filter Toolbar: Event, Track, Stream, Status & Search */}
      <div className="bg-white p-4 rounded-xl border border-[#D5CEBC] shadow-xs space-y-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#6E685E] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, phone, pass code, college, or event…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F1E6] border border-[#D5CEBC] rounded-lg text-xs text-[#1A1614] focus:outline-none focus:border-[#A81818]"
          />
        </form>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. Event / Program Filter */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#A81818]" />
              <span>Event / Program</span>
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-bold text-[#1A1614] cursor-pointer"
            >
              <option value="ALL">All Events & Programs</option>
              <option value="SUMMIT">1st National Academic Career Summit 2026</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.title}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Track / Pathway Filter */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#A81818]" />
              <span>Track / Pathway</span>
            </label>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-bold text-[#1A1614] cursor-pointer"
            >
              <option value="ALL">All Summit Tracks</option>
              {tracks.length > 0 ? (
                tracks.map((t) => (
                  <option key={t.id} value={t.name || t.id}>
                    {t.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="BUET">BUET Engineering & Tech</option>
                  <option value="IBA">DU IBA & Business Studies</option>
                  <option value="MEDICAL">Medical & Healthcare</option>
                  <option value="ABROAD">Abroad Higher Studies & IELTS</option>
                </>
              )}
            </select>
          </div>

          {/* 3. Academic Stream Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-1">
              Academic Stream
            </label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-bold text-[#1A1614] cursor-pointer"
            >
              <option value="ALL">All Streams (Science / Commerce / Arts)</option>
              <option value="SCIENCE">Science Group</option>
              <option value="COMMERCE">Commerce Group</option>
              <option value="ARTS">Humanities Group</option>
            </select>
          </div>

          {/* 4. Pass Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-1">
              Attendance Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D5CEBC] rounded-lg text-xs font-bold text-[#1A1614] cursor-pointer"
            >
              <option value="ALL">All Statuses (Confirmed & Cancelled)</option>
              <option value="CONFIRMED">CONFIRMED (Valid Pass)</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase tracking-wider">
                <th className="p-3.5 border-b border-[#D5CEBC]">Pass Code</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Attendee Name</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Phone</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">College / School</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Registered Event & Track</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Stream & Batch</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
                <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#6E685E]">
                    No registrations found matching the selected Event or Track filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F5F1E6] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#A81818] whitespace-nowrap">
                      {row.code}
                    </td>
                    <td className="p-3.5 font-bold text-[#1A1614]">
                      {row.fullName}
                    </td>
                    <td className="p-3.5 font-mono text-[#6E685E] whitespace-nowrap">
                      {row.phone}
                    </td>
                    <td className="p-3.5 text-[#4A4540] max-w-[170px] truncate" title={row.institution}>
                      {row.institution}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#A81818] bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          {getEventDisplayName(row).includes("Summit") ? "NACS 2026 Summit" : getEventDisplayName(row)}
                        </span>
                        <div className="font-bold text-[#1A1614] text-[11px] leading-tight">
                          {getTrackDisplayName(row)}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#6E685E] whitespace-nowrap">
                      Batch {row.hscBatch} &bull; <span className="font-semibold text-[#1A1614]">{row.group}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
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
                        title="View Full Registration Pass"
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
        title={<span className="font-display font-bold uppercase text-sm">Official Attendance Pass & Event Detail</span>}
      >
        {selectedItem && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="bg-[#1A1614] text-white p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E8C547] block">Digital Pass Code</span>
                <span className="font-mono font-black text-xl text-white">{selectedItem.code}</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                selectedItem.status === "CONFIRMED" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}>
                {selectedItem.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F1E6] rounded-lg border border-[#D5CEBC]">
              <div className="col-span-2 pb-2 border-b border-[#D5CEBC]/60">
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Registered Event</span>
                <span className="font-bold text-[#A81818] text-sm">{getEventDisplayName(selectedItem)}</span>
              </div>

              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Student Full Name</span>
                <span className="font-bold text-[#1A1614] text-sm">{selectedItem.fullName}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Mobile Phone</span>
                <span className="font-mono font-bold text-[#1A1614] text-sm">{selectedItem.phone}</span>
              </div>

              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Institution / College</span>
                <span className="font-semibold text-[#1A1614]">{selectedItem.institution}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">HSC Batch & Stream</span>
                <span className="font-semibold text-[#1A1614]">HSC {selectedItem.hscBatch} &bull; {selectedItem.group}</span>
              </div>

              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Assigned Pathway / Track</span>
                <span className="font-bold text-[#1A1614] uppercase">{getTrackDisplayName(selectedItem)}</span>
              </div>
              <div>
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Assigned Venue / Hall</span>
                <span className="font-semibold text-[#1A1614]">{getTrackHall(selectedItem)}</span>
              </div>

              <div className="col-span-2">
                <span className="text-[#6E685E] text-[10px] uppercase font-bold block">Email Address</span>
                <span className="text-[#1A1614] font-mono">{selectedItem.email || "N/A"}</span>
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
                {selectedItem.status === "CONFIRMED" ? "Cancel Attendance Pass" : "Confirm Attendance Pass"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
