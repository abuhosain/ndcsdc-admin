import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RefreshCw, Star } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { activitiesApi } from "../../services/api";

interface Activity {
  id: string;
  title: string;
  slug?: string;
  category: string;
  date?: string;
  eventDate?: string;
  venue?: string;
  summary?: string;
  isUpcoming?: boolean;
  isFeatured?: boolean;
  eventStatus?: "OPEN" | "CLOSING_SOON" | "FULL" | "CLOSED";
  registrationUrl?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [formState, setFormState] = useState({
    title: "",
    category: "Workshop",
    eventDate: "",
    venue: "Notre Dame College Campus, Dhaka",
    isUpcoming: true,
    isFeatured: false,
    eventStatus: "OPEN" as "OPEN" | "CLOSING_SOON" | "FULL" | "CLOSED",
    registrationUrl: "",
    summary: "",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });

  const loadActivities = async () => {
    try {
      setLoading(true);
      let list: Activity[] = [];
      try {
        const res = await activitiesApi.getAdminActivities();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          list = res.data;
        }
      } catch {
        // Fallback to public activities endpoint if admin token not present
        const pubRes = await activitiesApi.getPublicActivities();
        if (pubRes?.data && Array.isArray(pubRes.data)) {
          list = pubRes.data;
        }
      }

      if (list.length > 0) {
        const mapped = list.map((item: any) => ({
          ...item,
          eventDate: item.date ? item.date.slice(0, 10) : item.eventDate || "",
        }));
        setActivities(mapped);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load activities.");
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
      category: "Workshop",
      eventDate: new Date().toISOString().slice(0, 10),
      venue: "Notre Dame College Campus, Dhaka",
      isUpcoming: true,
      isFeatured: false,
      eventStatus: "OPEN",
      registrationUrl: "",
      summary: "",
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act: Activity) => {
    setEditingActivity(act);
    const dateVal = act.eventDate || (act.date ? act.date.slice(0, 10) : "");
    setFormState({
      title: act.title,
      category: act.category,
      eventDate: dateVal,
      venue: act.venue || "Notre Dame College Campus, Dhaka",
      isUpcoming: act.isUpcoming ?? true,
      isFeatured: act.isFeatured ?? false,
      eventStatus: act.eventStatus || "OPEN",
      registrationUrl: act.registrationUrl || "",
      summary: act.summary || "",
      status: act.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const toggleFeatured = async (act: Activity) => {
    const nextFeatured = !act.isFeatured;
    try {
      await activitiesApi.updateActivity(act.id, { isFeatured: nextFeatured });
      setActivities((prev) =>
        prev.map((item) => {
          if (item.id === act.id) {
            return { ...item, isFeatured: nextFeatured };
          }
          // If setting one as featured, unset all others
          return nextFeatured ? { ...item, isFeatured: false } : item;
        })
      );
      toast.success(
        nextFeatured
          ? `"${act.title}" is now the Homepage Spotlight Event.`
          : `Removed spotlight from "${act.title}".`
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update spotlight status in database.");
    }
  };

  const toggleStatus = async (act: Activity) => {
    const nextStatus = act.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await activitiesApi.updateActivity(act.id, { status: nextStatus });
      setActivities((prev) =>
        prev.map((item) => (item.id === act.id ? { ...item, status: nextStatus } : item))
      );
      toast.success(`Activity status changed to ${nextStatus}.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await activitiesApi.deleteActivity(id);
      setActivities((prev) => prev.filter((item) => item.id !== id));
      toast.success("Activity deleted successfully.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete activity.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      toast.error("Activity title is required.");
      return;
    }

    try {
      const payload = {
        ...formState,
        date: formState.eventDate,
      };

      if (editingActivity) {
        await activitiesApi.updateActivity(editingActivity.id, payload);
        toast.success("Activity updated successfully.");
      } else {
        await activitiesApi.createActivity({
          ...payload,
          slug: formState.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        toast.success("New activity published.");
      }
      setIsModalOpen(false);
      await loadActivities();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save activity.");
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
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] bg-rose-50 px-2.5 py-0.5 rounded">
                    {act.category}
                  </span>
                  {act.isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                      ⭐ Spotlight
                    </span>
                  )}
                  {act.isUpcoming && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Upcoming
                    </span>
                  )}
                </div>
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
              <div className="flex items-center gap-2">
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
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFeatured(act)}
                  title={act.isFeatured ? "Remove from Homepage Spotlight" : "Set as Homepage Spotlight Event"}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    act.isFeatured
                      ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                      : "text-[#6E685E] hover:text-amber-600 hover:bg-[#EFEADB]"
                  }`}
                >
                  <Star className={`w-4 h-4 ${act.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                </button>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Campus Venue / Location</label>
              <input
                type="text"
                placeholder="e.g. Auditorium Hall B"
                value={formState.venue}
                onChange={(e) => setFormState({ ...formState, venue: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Event Timeframe</label>
              <select
                value={formState.isUpcoming ? "UPCOMING" : "PAST"}
                onChange={(e) => setFormState({ ...formState, isUpcoming: e.target.value === "UPCOMING" })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer font-bold"
              >
                <option value="UPCOMING">Upcoming Event (Active Listings)</option>
                <option value="PAST">Past Activity (Archived Archive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEADB]">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Registration Status</label>
              <select
                value={formState.eventStatus}
                onChange={(e) => setFormState({ ...formState, eventStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer font-bold"
              >
                <option value="OPEN">OPEN (Accepting Registrations)</option>
                <option value="CLOSING_SOON">CLOSING SOON (Last Few Seats)</option>
                <option value="FULL">FULL (Capacity Reached)</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Dedicated Registration URL</label>
              <input
                type="text"
                placeholder="e.g. /summit/register or Google Form link"
                value={formState.registrationUrl}
                onChange={(e) => setFormState({ ...formState, registrationUrl: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Summary / Brief Description</label>
            <textarea
              rows={3}
              value={formState.summary}
              onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
              placeholder="Highlight what will be covered in this session..."
              className="w-full p-3 border border-[#D5CEBC] rounded-lg text-xs"
            ></textarea>
          </div>

          {/* Spotlight on Homepage Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50/70">
            <div>
              <span className="block text-xs font-bold text-amber-950">
                ⭐ Feature as Homepage Spotlight Event
              </span>
              <span className="block text-[11px] text-amber-800/80">
                Shows this event in the prominent banner on the website homepage. (Only 1 event can be spotlighted).
              </span>
            </div>
            <input
              type="checkbox"
              id="isFeaturedToggle"
              checked={formState.isFeatured}
              onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
              className="w-4 h-4 text-[#A81818] rounded cursor-pointer accent-[#A81818]"
            />
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
