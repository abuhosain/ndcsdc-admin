import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { activitiesApi } from "../../services/api";

interface Activity {
  id: string;
  title: string;
  category: string;
  eventDate?: string;
  summary?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: "National Academic Career Fair & Study Expo",
    category: "Study Fair",
    eventDate: "2025-11-15",
    summary: "Flagship multi-faculty fair connecting 800+ college students with university representatives and mock aptitude drills.",
    status: "PUBLISHED",
  },
  {
    id: "2",
    title: "IBA & BUP Analytical Problem Solving Workshop",
    category: "Masterclass",
    eventDate: "2026-01-20",
    summary: "Intensive workshop focused on quantitative shortcuts, critical reading heuristics, and mock viva evaluations.",
    status: "PUBLISHED",
  },
  {
    id: "3",
    title: "BUET & Engineering Physics Numerical Boot Camp",
    category: "Bootcamp",
    eventDate: "2026-03-10",
    summary: "Deep-dive technical session breaking down high-yield calculus, thermodynamics, and electromagnetism problem-solving.",
    status: "PUBLISHED",
  },
];

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [formState, setFormState] = useState({
    title: "",
    category: "Study Fair",
    eventDate: "",
    summary: "",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await activitiesApi.getAdminActivities();
      if (res.data && res.data.length > 0) {
        setActivities(res.data);
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    setFormState({
      title: "",
      category: "Study Fair",
      eventDate: new Date().toISOString().slice(0, 10),
      summary: "",
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act: Activity) => {
    setEditingActivity(act);
    setFormState({
      title: act.title,
      category: act.category,
      eventDate: act.eventDate ? act.eventDate.slice(0, 10) : "",
      summary: act.summary || "",
      status: act.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (act: Activity) => {
    const nextStatus = act.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await activitiesApi.updateActivity(act.id, { status: nextStatus });
      setActivities((prev) =>
        prev.map((item) => (item.id === act.id ? { ...item, status: nextStatus } : item))
      );
      toast.success(`Activity status changed to ${nextStatus}.`);
    } catch {
      setActivities((prev) =>
        prev.map((item) => (item.id === act.id ? { ...item, status: nextStatus } : item))
      );
      toast.success(`Activity status changed to ${nextStatus} (Local).`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await activitiesApi.deleteActivity(id);
      setActivities((prev) => prev.filter((item) => item.id !== id));
      toast.success("Activity deleted.");
    } catch {
      setActivities((prev) => prev.filter((item) => item.id !== id));
      toast.success("Activity deleted (Local).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      toast.error("Activity title is required.");
      return;
    }

    try {
      if (editingActivity) {
        await activitiesApi.updateActivity(editingActivity.id, formState);
        setActivities((prev) =>
          prev.map((a) => (a.id === editingActivity.id ? { ...a, ...formState } : a))
        );
        toast.success("Activity updated successfully.");
      } else {
        const res = await activitiesApi.createActivity({
          ...formState,
          slug: formState.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        const created = res.data || { id: String(Date.now()), ...formState };
        setActivities((prev) => [created, ...prev]);
        toast.success("New activity published.");
      }
    } catch {
      if (editingActivity) {
        setActivities((prev) =>
          prev.map((a) => (a.id === editingActivity.id ? { ...a, ...formState } : a))
        );
      } else {
        setActivities((prev) => [{ id: String(Date.now()), ...formState }, ...prev]);
      }
      toast.success("Activity saved (Local).");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Club Activities Management
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Publish and manage seminars, analytical workshops, bootcamps and study fairs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadActivities}
            title="Refresh"
            className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Activity</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] bg-rose-50 px-2.5 py-0.5 rounded">
                  {act.category}
                </span>
                <span className="font-mono text-xs text-[#6E685E]">
                  {act.eventDate ? act.eventDate.slice(0, 10) : "Recent"}
                </span>
              </div>

              <h3 className="font-display font-bold text-base uppercase text-[#1A1614] mb-2 leading-tight">
                {act.title}
              </h3>
              <p className="text-xs text-[#6E685E] line-clamp-3 leading-relaxed">
                {act.summary || "No summary provided."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#EFEADB] mt-4 flex items-center justify-between">
              <button
                onClick={() => toggleStatus(act)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                  act.status === "PUBLISHED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {act.status}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(act)}
                  title="Edit Activity"
                  className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(act.id)}
                  title="Delete Activity"
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title={
          <span className="font-display font-bold uppercase text-sm">
            {editingActivity ? "Edit Club Activity" : "Create New Activity"}
          </span>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Activity Title <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. IBA Analytical Problem Solving Workshop"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Category</label>
              <select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
              >
                <option value="Study Fair">Study Fair</option>
                <option value="Masterclass">Masterclass</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Event Date</label>
              <input
                type="date"
                value={formState.eventDate}
                onChange={(e) => setFormState({ ...formState, eventDate: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Summary / Brief Description</label>
            <textarea
              rows={4}
              value={formState.summary}
              onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
              placeholder="Highlight what will be covered in this session..."
              className="w-full p-3 border border-[#D5CEBC] rounded-lg text-xs"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Publishing Status</label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
            >
              <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
              <option value="DRAFT">DRAFT (Internal Review Only)</option>
            </select>
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
              {editingActivity ? "Update Activity" : "Publish Activity"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
