import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SummitManagementPage() {
  const [activeTab, setActiveTab] = useState<"tracks" | "schedule" | "speakers" | "faqs">("tracks");

  // Mock Tracks
  const [tracks] = useState([
    { id: "1", name: "BUET & Engineering Drills", stream: "Science", capacity: 600, registered: 480, hall: "Science Building Room 301–304" },
    { id: "2", name: "IBA & Business Leadership", stream: "Commerce / Open", capacity: 450, registered: 350, hall: "Auditorium Hall A" },
    { id: "3", name: "Medical & Healthcare Strategy", stream: "Science", capacity: 450, registered: 284, hall: "Auditorium Hall B" },
    { id: "4", name: "Abroad Studies & Global IELTS", stream: "All Streams", capacity: 300, registered: 170, hall: "Seminar Hall C" },
  ]);

  // Mock Schedule
  const [schedule, setSchedule] = useState([
    { id: "1", time: "08:30 – 09:30", title: "Participant Check-In & Welcome Kit", hall: "Registration Desk", type: "Check-In" },
    { id: "2", time: "09:30 – 10:30", title: "Grand Inaugural Ceremony & Keynote", hall: "Main Auditorium", type: "Ceremony" },
    { id: "3", time: "10:45 – 12:45", title: "Track-Wise Masterclasses & Drills", hall: "Designated Halls", type: "Masterclass" },
    { id: "4", time: "12:45 – 01:45", title: "Lunch & Networking Prayer Break", hall: "Courtyard & Dining", type: "Break" },
    { id: "5", time: "02:00 – 03:30", title: "Simulated National Mock Examination", hall: "Examination Halls", type: "Mock Test" },
    { id: "6", time: "03:45 – 04:45", title: "Live Paper Solution & Career Panel", hall: "Main Auditorium", type: "Panel" },
    { id: "7", time: "05:00 – 06:00", title: "Closing Ceremony & Prize Giving", hall: "Main Auditorium", type: "Awards" },
  ]);

  // Mock FAQs
  const [faqs, setFaqs] = useState([
    { id: "1", q: "Who is eligible to participate in NACS 2026?", a: "HSC Batch 2026, 2027, and 2028 students from all streams across Bangladesh." },
    { id: "2", q: "Is there any registration fee for the summit?", a: "No. Registration is 100% free for all registered student participants." },
    { id: "3", q: "Will participants receive an official certificate?", a: "Yes. All students will receive an official Certificate of Participation." },
  ]);

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
                  onClick={() => toast.info("Track settings are configured via Site Settings.")}
                  className="text-xs font-bold text-[#A81818] hover:underline"
                >
                  Edit Capacity &rarr;
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
              onClick={() => toast.success("New schedule item modal opened.")}
              className="px-3 py-1.5 bg-[#A81818] text-white text-xs font-bold uppercase rounded inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          </div>

          <div className="divide-y divide-[#EFEADB]">
            {schedule.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#F5F1E6] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-xs text-[#A81818] w-28">
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id, "schedule")}
                    className="p-1 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
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
              onClick={() => toast.success("New FAQ modal opened.")}
              className="px-3 py-1.5 bg-[#A81818] text-white text-xs font-bold uppercase rounded inline-flex items-center gap-1.5"
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
                <button
                  onClick={() => handleDelete(faq.id, "faqs")}
                  className="p-1 text-rose-700 hover:bg-rose-50 rounded cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
