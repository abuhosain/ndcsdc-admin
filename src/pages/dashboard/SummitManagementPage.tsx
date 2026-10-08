import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface TrackItem {
  id: string;
  name: string;
  stream: string;
  capacity: number;
  registered: number;
  hall: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  hall: string;
  type: string;
}

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export default function SummitManagementPage() {
  const [activeTab, setActiveTab] = useState<"tracks" | "schedule" | "faqs">("tracks");

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

  // Open Handlers
  const openEditTrack = (trk: TrackItem) => {
    setModalType("track");
    setEditingItem(trk);
    setTrackForm({ name: trk.name, stream: trk.stream, capacity: trk.capacity, hall: trk.hall });
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
    setScheduleForm({ time: item.time, title: item.title, hall: item.hall, type: item.type });
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

  // Submit Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === "track" && editingItem) {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? { ...t, name: trackForm.name, stream: trackForm.stream, capacity: Number(trackForm.capacity), hall: trackForm.hall }
            : t
        )
      );
      toast.success("Summit track updated successfully.");
    } else if (modalType === "schedule") {
      if (editingItem) {
        setSchedule((prev) =>
          prev.map((s) => (s.id === editingItem.id ? { ...s, ...scheduleForm } : s))
        );
        toast.success("Schedule session updated.");
      } else {
        const newSession: ScheduleItem = { id: String(Date.now()), ...scheduleForm };
        setSchedule([...schedule, newSession]);
        toast.success("New schedule session added.");
      }
    } else if (modalType === "faq") {
      if (editingItem) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...faqForm } : f))
        );
        toast.success("FAQ updated.");
      } else {
        const newFaq: FaqItem = { id: String(Date.now()), ...faqForm };
        setFaqs([...faqs, newFaq]);
        toast.success("New FAQ added.");
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, type: string) => {
    if (type === "schedule") setSchedule((prev) => prev.filter((s) => s.id !== id));
    if (type === "faqs") setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success("Item removed successfully.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Summit Configuration & Modules
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            1st National Academic Career Summit 2026 &bull; 14 Nov 2026
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#D5CEBC] rounded-lg">
          {[
            { id: "tracks", label: "Tracks" },
            { id: "schedule", label: "Schedule" },
            { id: "faqs", label: "FAQs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1A1614] text-white"
                  : "text-[#6E685E] hover:text-[#1A1614]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: TRACKS */}
      {activeTab === "tracks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((trk) => (
            <div
              key={trk.id}
              className="bg-white border border-[#D5CEBC] rounded-xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#EFEADB] text-[#1A1614] rounded">
                    {trk.stream}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#A81818]">
                    {trk.registered} / {trk.capacity} Seats
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg uppercase text-[#1A1614] mb-1">
                  {trk.name}
                </h3>
                <p className="text-xs text-[#6E685E]">
                  Venue: <strong>{trk.hall}</strong>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EFEADB] flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">
                  Mock Test Assigned (02:00 PM)
                </span>
                <button
                  onClick={() => openEditTrack(trk)}
                  className="px-3 py-1.5 bg-[#1A1614] text-white text-xs font-bold uppercase rounded inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#A81818] transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Track</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EFEADB] flex items-center justify-between">
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Program Timeline (14 Nov 2026)
            </h3>
            <button
              onClick={openAddSchedule}
              className="px-3.5 py-2 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          </div>

          <div className="divide-y divide-[#EFEADB]">
            {schedule.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#F5F1E6] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-xs text-[#A81818] w-28 shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <span className="font-display font-bold text-sm text-[#1A1614] block">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#6E685E]">
                      {item.hall} &bull; <span className="uppercase text-[10px] font-semibold">{item.type}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditSchedule(item)}
                    className="p-1.5 text-[#1A1614] hover:bg-[#EFEADB] rounded cursor-pointer transition-colors"
                    title="Edit Session"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, "schedule")}
                    className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQS */}
      {activeTab === "faqs" && (
        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EFEADB] flex items-center justify-between">
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Public FAQs
            </h3>
            <button
              onClick={openAddFaq}
              className="px-3.5 py-2 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="divide-y divide-[#EFEADB]">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-5 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-sm text-[#1A1614] mb-1">
                    {faq.q}
                  </h4>
                  <p className="text-xs text-[#4A4540] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditFaq(faq)}
                    className="p-1.5 text-[#1A1614] hover:bg-[#EFEADB] rounded cursor-pointer transition-colors"
                    title="Edit FAQ"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id, "faqs")}
                    className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Summit Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            {modalType === "track" && "Edit Summit Track & Capacity"}
            {modalType === "schedule" && (editingItem ? "Edit Schedule Session" : "Add Schedule Session")}
            {modalType === "faq" && (editingItem ? "Edit Summit FAQ" : "Add Summit FAQ")}
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          {modalType === "track" && (
            <>
              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Track Name</label>
                <input
                  type="text"
                  required
                  value={trackForm.name}
                  onChange={(e) => setTrackForm({ ...trackForm, name: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1614] uppercase mb-1">Target Stream</label>
                  <input
                    type="text"
                    required
                    value={trackForm.stream}
                    onChange={(e) => setTrackForm({ ...trackForm, stream: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1614] uppercase mb-1">Max Seat Capacity</label>
                  <input
                    type="number"
                    required
                    value={trackForm.capacity}
                    onChange={(e) => setTrackForm({ ...trackForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Assigned Venue / Hall</label>
                <input
                  type="text"
                  required
                  value={trackForm.hall}
                  onChange={(e) => setTrackForm({ ...trackForm, hall: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                />
              </div>
            </>
          )}

          {modalType === "schedule" && (
            <>
              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Time Range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:45 – 12:45"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass & Drills"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1614] uppercase mb-1">Venue / Room</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Auditorium"
                    value={scheduleForm.hall}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, hall: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1614] uppercase mb-1">Session Type</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold cursor-pointer"
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
            </>
          )}

          {modalType === "faq" && (
            <>
              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Is registration free?"
                  value={faqForm.q}
                  onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1614] uppercase mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed answer text..."
                  value={faqForm.a}
                  onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
                ></textarea>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-[#EFEADB] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#D5CEBC] rounded text-xs font-bold uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 text-xs uppercase font-bold cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
