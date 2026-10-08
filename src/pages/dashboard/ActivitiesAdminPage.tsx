import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  status: "PUBLISHED" | "DRAFT";
}

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "National Academic Career Fair & Study Expo",
    category: "Study Fair",
    date: "2025-11-15",
    summary: "Flagship multi-faculty fair connecting 800+ college students with university representatives and mock aptitude drills.",
    status: "PUBLISHED",
  },
  {
    id: "2",
    title: "IBA & BUP Analytical Problem Solving Workshop",
    category: "Masterclass",
    date: "2026-01-20",
    summary: "Intensive workshop focused on quantitative shortcuts, critical reading heuristics, and mock viva evaluations.",
    status: "PUBLISHED",
  },
  {
    id: "3",
    title: "BUET & Engineering Physics Numerical Boot Camp",
    category: "Bootcamp",
    date: "2026-03-10",
    summary: "Deep-dive technical session breaking down high-yield calculus, thermodynamics, and electromagnetism problem-solving.",
    status: "PUBLISHED",
  },
];

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    category: "Study Fair",
    date: "",
    summary: "",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });

  const toggleStatus = (id: string) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id
          ? { ...act, status: act.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
          : act
      )
    );
    toast.success("Activity status updated.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    const newAct: Activity = {
      id: String(Date.now()),
      ...formState,
    };

    setActivities([newAct, ...activities]);
    setIsModalOpen(false);
    setFormState({ title: "", category: "Study Fair", date: "", summary: "", status: "PUBLISHED" });
    toast.success("Activity published successfully.");
  };

  const handleDelete = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    toast.success("Activity deleted.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Activities & Event Posts
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage past highlights, campus workshops, and study fairs
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Activity Post</span>
        </button>
      </div>

      {/* Activities Grid / Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
              <th className="p-3.5 border-b border-[#D5CEBC]">Activity Title</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Category</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Date</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
              <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEADB]">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-[#F5F1E6] transition-colors">
                <td className="p-3.5">
                  <span className="font-display font-bold text-sm text-[#1A1614] block">
                    {act.title}
                  </span>
                  <span className="text-xs text-[#6E685E] line-clamp-1 max-w-md">
                    {act.summary}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 bg-[#EFEADB] text-[#1A1614] font-bold uppercase rounded text-[10px]">
                    {act.category}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[#6E685E]">{act.date}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => toggleStatus(act.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      act.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {act.status}
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDelete(act.id)}
                    className="p-1 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete Activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Activity Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Create New Activity Post
          </span>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Title <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Olympiad Mentorship Camp"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">Category</label>
              <select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold"
              >
                <option value="Study Fair">Study Fair</option>
                <option value="Masterclass">Masterclass</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">Event Date</label>
              <input
                type="date"
                required
                value={formState.date}
                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Short Summary</label>
            <textarea
              rows={3}
              required
              placeholder="Brief description of the event, attendees, and highlights..."
              value={formState.summary}
              onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-[#D5CEBC] rounded text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 text-xs uppercase font-bold"
            >
              Save Activity
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
