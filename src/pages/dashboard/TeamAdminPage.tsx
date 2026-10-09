import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { teamApi } from "../../services/api";

export interface Member {
  id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  facebookUrl?: string;
  panelYear?: string;
  isModerator?: boolean;
  isVisible?: boolean;
  sortOrder?: number;
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Md. Safiul Alam",
    designation: "Club Moderator",
    phone: "+880 1700-000000",
    email: "moderator.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "Permanent",
    isModerator: true,
    isVisible: true,
  },
  {
    id: "2",
    name: "Mirza Rafid Ahmed",
    designation: "General Secretary",
    phone: "+880 1711-234567",
    email: "rafid.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
  {
    id: "3",
    name: "Zubair Al Mahmud",
    designation: "Joint Secretary",
    phone: "+880 1812-345678",
    email: "zubair.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
  {
    id: "4",
    name: "A. S. M. Farhan",
    designation: "President (Administration)",
    phone: "+880 1913-456789",
    email: "farhan.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
  {
    id: "5",
    name: "Syed Tanvir Hasan",
    designation: "Vice President",
    phone: "+880 1614-567890",
    email: "tanvir.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
  {
    id: "6",
    name: "Shadman Sakib",
    designation: "Director of PR",
    phone: "+880 1515-678901",
    email: "pr.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    facebookUrl: "",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  });

  const loadTeam = async () => {
    try {
      setLoading(true);
      const res = await teamApi.getAdminTeam();
      if (res.data && res.data.length > 0) {
        setMembers(res.data);
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormState({
      name: "",
      designation: "",
      phone: "",
      email: "",
      facebookUrl: "https://facebook.com",
      panelYear: "2025-26",
      isModerator: false,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setFormState({
      name: m.name,
      designation: m.designation,
      phone: m.phone || "",
      email: m.email || "",
      facebookUrl: m.facebookUrl || "",
      panelYear: m.panelYear || "2025-26",
      isModerator: Boolean(m.isModerator),
      isVisible: m.isVisible !== false,
    });
    setIsModalOpen(true);
  };

  const toggleVisibility = async (m: Member) => {
    const nextVis = !m.isVisible;
    try {
      await teamApi.updateMember(m.id, { isVisible: nextVis });
      setMembers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, isVisible: nextVis } : item))
      );
      toast.success("Member visibility updated.");
    } catch {
      setMembers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, isVisible: nextVis } : item))
      );
      toast.success("Member visibility updated (Local).");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await teamApi.deleteMember(id);
      setMembers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Team member deleted.");
    } catch {
      setMembers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Team member deleted (Local).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.designation.trim()) {
      toast.error("Name and designation are required.");
      return;
    }

    try {
      if (editingMember) {
        await teamApi.updateMember(editingMember.id, formState);
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? { ...m, ...formState } : m))
        );
        toast.success("Team member updated.");
      } else {
        const res = await teamApi.createMember(formState);
        const created = res.data || { id: String(Date.now()), ...formState };
        setMembers((prev) => [...prev, created]);
        toast.success("New team member added.");
      }
    } catch {
      if (editingMember) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? { ...m, ...formState } : m))
        );
      } else {
        setMembers((prev) => [...prev, { id: String(Date.now()), ...formState }]);
      }
      toast.success("Team member saved (Local).");
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
            Team & Committee Management
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage moderator profile, executive panel contacts, and public leadership directory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTeam}
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
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    m.isModerator
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-[#F5F1E6] text-[#6E685E]"
                  }`}
                >
                  {m.isModerator ? "Faculty Moderator" : m.panelYear || "Executive"}
                </span>

                <button
                  onClick={() => toggleVisibility(m)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    m.isVisible !== false
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {m.isVisible !== false ? "Visible" : "Hidden"}
                </button>
              </div>

              <h3 className="font-display font-bold text-base uppercase text-[#1A1614]">
                {m.name}
              </h3>
              <div className="text-xs font-semibold text-[#A81818] mb-3">
                {m.designation}
              </div>

              <div className="space-y-1 text-xs text-[#6E685E] border-t border-[#EFEADB] pt-2.5">
                <div><strong>Phone:</strong> {m.phone || "N/A"}</div>
                <div><strong>Email:</strong> {m.email || "N/A"}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EFEADB] mt-4 flex items-center justify-between">
              <a
                href={m.facebookUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#6E685E] hover:text-[#A81818]"
              >
                Profile Link &rarr;
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(m)}
                  title="Edit Member"
                  className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {!m.isModerator && (
                  <button
                    onClick={() => handleDelete(m.id)}
                    title="Delete Member"
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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
            {editingMember ? "Edit Team Member" : "Add Executive / Moderator"}
          </span>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Full Name <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mirza Rafid Ahmed"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="e.g. General Secretary"
                value={formState.designation}
                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Panel Year</label>
              <input
                type="text"
                placeholder="2025-26"
                value={formState.panelYear}
                onChange={(e) => setFormState({ ...formState, panelYear: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Phone</label>
              <input
                type="text"
                placeholder="+880 17XXXXXXXX"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1614] mb-1">Email</label>
              <input
                type="email"
                placeholder="name@ndcsdc.org"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Facebook / Social URL</label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={formState.facebookUrl}
              onChange={(e) => setFormState({ ...formState, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formState.isModerator}
                onChange={(e) => setFormState({ ...formState, isModerator: e.target.checked })}
                className="rounded"
              />
              <span>Faculty Moderator Role</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formState.isVisible}
                onChange={(e) => setFormState({ ...formState, isVisible: e.target.checked })}
                className="rounded"
              />
              <span>Visible on Website</span>
            </label>
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
              {editingMember ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
