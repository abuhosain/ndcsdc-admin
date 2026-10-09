import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { summitApi } from "../../services/api";

interface TrackItem {
  id: string;
  name: string;
  stream: string;
  capacity: number;
  registered?: number;
  hall?: string;
  description?: string;
  _count?: {
    registrations: number;
  };
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  hall?: string;
  type?: string;
  sortOrder?: number;
}

interface FaqItem {
  id: string;
  q: string;
  a: string;
  sortOrder?: number;
}

export default function SummitManagementPage() {
  const [activeTab, setActiveTab] = useState<"tracks" | "schedule" | "faqs">("tracks");
  const [loading, setLoading] = useState(false);

  // Tracks State
  const [tracks, setTracks] = useState<TrackItem[]>([
    { id: "1", name: "BUET & Engineering Drills", stream: "Science", capacity: 600, registered: 480, hall: "Science Building Room 301–304" },
    { id: "2", name: "IBA & Business Leadership", stream: "Commerce / Open", capacity: 450, registered: 350, hall: "Auditorium Hall A" },
    { id: "3", name: "Medical & Healthcare Strategy", stream: "Science", capacity: 450, registered: 284, hall: "Auditorium Hall B" },
    { id: "4", name: "Abroad Studies & Global IELTS", stream: "All Streams", capacity: 300, registered: 170, hall: "Seminar Hall C" },
  ]);

  // Schedule State
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: "1", time: "08:30 – 09:30", title: "Participant Check-In & Welcome Kit", hall: "Registration Desk", type: "Check-In" },
    { id: "2", time: "09:30 – 10:30", title: "Grand Inaugural Ceremony & Keynote", hall: "Main Auditorium", type: "Ceremony" },
    { id: "3", time: "10:45 – 12:45", title: "Track-Wise Masterclasses & Drills", hall: "Designated Halls", type: "Masterclass" },
    { id: "4", time: "12:45 – 01:45", title: "Lunch & Networking Prayer Break", hall: "Courtyard & Dining", type: "Break" },
    { id: "5", time: "02:00 – 03:30", title: "Simulated National Mock Examination", hall: "Examination Halls", type: "Mock Test" },
    { id: "6", time: "03:45 – 04:45", title: "Live Paper Solution & Career Panel", hall: "Main Auditorium", type: "Panel" },
    { id: "7", time: "05:00 – 06:00", title: "Closing Ceremony & Prize Giving", hall: "Main Auditorium", type: "Awards" },
  ]);

  // FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { id: "1", q: "Who is eligible to participate in NACS 2026?", a: "HSC Batch 2026, 2027, and 2028 students from all streams across Bangladesh." },
    { id: "2", q: "Is there any registration fee for the summit?", a: "No. Registration is 100% free for all registered student participants." },
    { id: "3", q: "Will participants receive an official certificate?", a: "Yes. All students will receive an official Certificate of Participation." },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"track" | "schedule" | "faq">("schedule");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States
  const [trackForm, setTrackForm] = useState({ name: "", stream: "Science", capacity: 500, hall: "" });
  const [scheduleForm, setScheduleForm] = useState({ time: "", title: "", hall: "", type: "Masterclass" });
  const [faqForm, setFaqForm] = useState({ q: "", a: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [trRes, scRes, fqRes] = await Promise.allSettled([
        summitApi.getTracks(),
        summitApi.getSchedule(),
        summitApi.getFaqs(),
      ]);

      if (trRes.status === "fulfilled" && trRes.value.data && trRes.value.data.length > 0) {
        setTracks(trRes.value.data);
      }
      if (scRes.status === "fulfilled" && scRes.value.data && scRes.value.data.length > 0) {
        setSchedule(scRes.value.data);
      }
      if (fqRes.status === "fulfilled" && fqRes.value.data && fqRes.value.data.length > 0) {
        setFaqs(fqRes.value.data);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Handlers
  const openEditTrack = (trk: TrackItem) => {
    setModalType("track");
    setEditingItem(trk);
    setTrackForm({ name: trk.name, stream: trk.stream, capacity: trk.capacity, hall: trk.hall || "" });
    setIsModalOpen(true);
  };

  const openAddSchedule = () => {
    setModalType("schedule");
    setEditingItem(null);
    setScheduleForm({ time: "09:00 – 10:00", title: "", hall: "Main Auditorium", type: "Masterclass" });
    setIsModalOpen(true);
  };

  const openEditSchedule = (item: ScheduleItem) => {
    setModalType("schedule");
    setEditingItem(item);
    setScheduleForm({ time: item.time, title: item.title, hall: item.hall || "", type: item.type || "Masterclass" });
    setIsModalOpen(true);
  };

  const openAddFaq = () => {
    setModalType("faq");
    setEditingItem(null);
    setFaqForm({ q: "", a: "" });
    setIsModalOpen(true);
  };

  const openEditFaq = (faq: FaqItem) => {
    setModalType("faq");
    setEditingItem(faq);
    setFaqForm({ q: faq.q, a: faq.a });
    setIsModalOpen(true);
  };

  // Submit Handlers
  const handleSaveTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await summitApi.updateTrack(editingItem.id, {
        name: trackForm.name,
        stream: trackForm.stream,
        capacity: Number(trackForm.capacity),
        hall: trackForm.hall,
      });
      setTracks((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? { ...t, ...trackForm, capacity: Number(trackForm.capacity) }
            : t
        )
      );
      toast.success("Summit Track capacity and venue updated.");
    } catch {
      // Local optimistic update
      setTracks((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? { ...t, ...trackForm, capacity: Number(trackForm.capacity) }
            : t
        )
      );
      toast.success("Summit Track updated (Local).");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.title.trim()) {
      toast.error("Session title is required.");
      return;
    }

    try {
      if (editingItem) {
        await summitApi.updateScheduleItem(editingItem.id, scheduleForm);
        setSchedule((prev) =>
          prev.map((s) => (s.id === editingItem.id ? { ...s, ...scheduleForm } : s))
        );
        toast.success("Schedule session updated.");
      } else {
        const res = await summitApi.createScheduleItem(scheduleForm);
        const newItem: ScheduleItem = res.data || {
          id: String(Date.now()),
          ...scheduleForm,
        };
        setSchedule((prev) => [...prev, newItem]);
        toast.success("New schedule item added.");
      }
    } catch {
      // Local fallback
      if (editingItem) {
        setSchedule((prev) =>
          prev.map((s) => (s.id === editingItem.id ? { ...s, ...scheduleForm } : s))
        );
      } else {
        setSchedule((prev) => [...prev, { id: String(Date.now()), ...scheduleForm }]);
      }
      toast.success("Schedule item saved (Local).");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await summitApi.deleteScheduleItem(id);
      setSchedule((prev) => prev.filter((s) => s.id !== id));
      toast.success("Schedule session deleted.");
    } catch {
      setSchedule((prev) => prev.filter((s) => s.id !== id));
      toast.success("Schedule session deleted (Local).");
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.q.trim() || !faqForm.a.trim()) {
      toast.error("Both question and answer are required.");
      return;
    }

    try {
      if (editingItem) {
        await summitApi.updateFaq(editingItem.id, faqForm);
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...faqForm } : f))
        );
        toast.success("FAQ updated.");
      } else {
        const res = await summitApi.createFaq(faqForm);
        const newItem: FaqItem = res.data || {
          id: String(Date.now()),
          ...faqForm,
        };
        setFaqs((prev) => [...prev, newItem]);
        toast.success("New FAQ added.");
      }
    } catch {
      if (editingItem) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...faqForm } : f))
        );
      } else {
        setFaqs((prev) => [...prev, { id: String(Date.now()), ...faqForm }]);
      }
      toast.success("FAQ saved (Local).");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await summitApi.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ deleted.");
    } catch {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      toast.success("FAQ deleted (Local).");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            NACS 2026 Summit Management
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Configure pathways, hall capacity limits, 14 Nov program schedule, and public FAQs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Refresh"
            className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          {activeTab === "schedule" && (
            <button
              onClick={openAddSchedule}
              className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Session</span>
            </button>
          )}
          {activeTab === "faqs" && (
            <button
              onClick={openAddFaq}
              className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D5CEBC] pb-3">
        <button
          onClick={() => setActiveTab("tracks")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "tracks"
              ? "bg-[#1A1614] text-white"
              : "bg-white text-[#6E685E] border border-[#D5CEBC] hover:text-[#1A1614]"
          }`}
        >
          Tracks & Capacity ({tracks.length})
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "schedule"
              ? "bg-[#1A1614] text-white"
              : "bg-white text-[#6E685E] border border-[#D5CEBC] hover:text-[#1A1614]"
          }`}
        >
          Program Schedule ({schedule.length})
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "faqs"
              ? "bg-[#1A1614] text-white"
              : "bg-white text-[#6E685E] border border-[#D5CEBC] hover:text-[#1A1614]"
          }`}
        >
          Summit FAQs ({faqs.length})
        </button>
      </div>

      {/* 1. TRACKS TAB */}
      {activeTab === "tracks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((trk) => {
            const registered = trk._count?.registrations ?? trk.registered ?? 0;
            const pct = Math.min(100, Math.round((registered / trk.capacity) * 100));
            return (
              <div
                key={trk.id}
                className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] bg-rose-50 px-2 py-0.5 rounded">
                        {trk.stream}
                      </span>
                      <h3 className="font-display font-bold text-base uppercase text-[#1A1614] mt-1.5">
                        {trk.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTrack(trk)}
                      className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                      title="Edit Track"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-[#6E685E] space-y-1 mb-4">
                    <div><strong>Venue / Hall:</strong> {trk.hall || "Designated Room"}</div>
                    <div><strong>Live Attendance:</strong> {registered} registered ({pct}%)</div>
                  </div>

                  <div className="w-full bg-[#EFEADB] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-[#A81818] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFEADB] flex items-center justify-between text-xs">
                  <span className="text-[#6E685E]">Seat Limit:</span>
                  <span className="font-bold text-[#1A1614]">{trk.capacity} Seats</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SCHEDULE TAB */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase tracking-wider">
                  <th className="p-3.5 border-b border-[#D5CEBC]">Time Window</th>
                  <th className="p-3.5 border-b border-[#D5CEBC]">Session Title</th>
                  <th className="p-3.5 border-b border-[#D5CEBC]">Venue / Hall</th>
                  <th className="p-3.5 border-b border-[#D5CEBC]">Type</th>
                  <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEADB]">
                {schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F1E6] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#A81818]">{item.time}</td>
                    <td className="p-3.5 font-bold text-[#1A1614]">{item.title}</td>
                    <td className="p-3.5 text-[#4A4540]">{item.hall}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditSchedule(item)}
                        title="Edit Session"
                        className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(item.id)}
                        title="Delete Session"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. FAQS TAB */}
      {activeTab === "faqs" && (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <h4 className="font-display font-bold text-sm text-[#1A1614]">
                  {faq.q}
                </h4>
                <p className="text-xs text-[#6E685E] leading-relaxed">
                  {faq.a}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditFaq(faq)}
                  title="Edit FAQ"
                  className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  title="Delete FAQ"
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL (Track / Schedule / Faq) */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title={
          <span className="font-display font-bold uppercase text-sm">
            {modalType === "track" && "Edit Summit Track & Capacity"}
            {modalType === "schedule" && (editingItem ? "Edit Schedule Session" : "Add Program Session")}
            {modalType === "faq" && (editingItem ? "Edit Summit FAQ" : "Add Summit FAQ")}
          </span>
        }
      >
        {/* Track Form */}
        {modalType === "track" && (
          <form onSubmit={handleSaveTrack} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Track Name</label>
              <input
                type="text"
                required
                value={trackForm.name}
                onChange={(e) => setTrackForm({ ...trackForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1614] mb-1">Stream</label>
                <input
                  type="text"
                  value={trackForm.stream}
                  onChange={(e) => setTrackForm({ ...trackForm, stream: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1614] mb-1">Capacity Limit</label>
                <input
                  type="number"
                  required
                  value={trackForm.capacity}
                  onChange={(e) => setTrackForm({ ...trackForm, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Designated Hall / Venue</label>
              <input
                type="text"
                value={trackForm.hall}
                onChange={(e) => setTrackForm({ ...trackForm, hall: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#D5CEBC] rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#A81818] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Save Track
              </button>
            </div>
          </form>
        )}

        {/* Schedule Form */}
        {modalType === "schedule" && (
          <form onSubmit={handleSaveSchedule} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Time Slot (e.g. 09:30 – 10:30)</label>
              <input
                type="text"
                required
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Session Title</label>
              <input
                type="text"
                required
                value={scheduleForm.title}
                onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1614] mb-1">Venue / Room</label>
                <input
                  type="text"
                  value={scheduleForm.hall}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, hall: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1614] mb-1">Session Category</label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
                >
                  <option value="Check-In">Check-In</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Masterclass">Masterclass</option>
                  <option value="Break">Break</option>
                  <option value="Mock Test">Mock Test</option>
                  <option value="Panel">Panel</option>
                  <option value="Awards">Awards</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#D5CEBC] rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#A81818] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Save Session
              </button>
            </div>
          </form>
        )}

        {/* FAQ Form */}
        {modalType === "faq" && (
          <form onSubmit={handleSaveFaq} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Question</label>
              <input
                type="text"
                required
                value={faqForm.q}
                onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                placeholder="e.g. Is participation certificate provided?"
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Answer</label>
              <textarea
                rows={4}
                required
                value={faqForm.a}
                onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                placeholder="Detailed answer text..."
                className="w-full p-3 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#D5CEBC] rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#A81818] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Save FAQ
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
