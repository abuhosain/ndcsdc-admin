import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  designation: string;
  panelYear: string;
  isModerator: boolean;
  isVisible: boolean;
}

const INITIAL_MEMBERS: Member[] = [
  { id: "1", name: "Md. Safiul Alam", designation: "Club Moderator", panelYear: "Permanent", isModerator: true, isVisible: true },
  { id: "2", name: "A. S. M. Farhan", designation: "President (Administration)", panelYear: "2025-26", isModerator: false, isVisible: true },
  { id: "3", name: "Syed Tanvir Hasan", designation: "Vice President", panelYear: "2025-26", isModerator: false, isVisible: true },
  { id: "4", name: "Mirza Rafid Ahmed", designation: "General Secretary", panelYear: "2025-26", isModerator: false, isVisible: true },
  { id: "5", name: "Zubair Al Mahmud", designation: "Joint Secretary", panelYear: "2025-26", isModerator: false, isVisible: true },
  { id: "6", name: "Shadman Sakib", designation: "Director of PR", panelYear: "2025-26", isModerator: false, isVisible: true },
  { id: "7", name: "Nabil Chowdhury", designation: "Director of Operations", panelYear: "2025-26", isModerator: false, isVisible: true },
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    panelYear: "2025-26",
    isModerator: false,
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormState({
      name: "",
      designation: "",
      panelYear: "2025-26",
      isModerator: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setFormState({
      name: m.name,
      designation: m.designation,
      panelYear: m.panelYear,
      isModerator: m.isModerator,
    });
    setIsModalOpen(true);
  };

  const toggleVisibility = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVisible: !m.isVisible } : m))
    );
    toast.success("Visibility updated.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    if (editingMember) {
      // Update existing
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formState.name,
                designation: formState.designation,
                panelYear: formState.panelYear,
                isModerator: formState.isModerator,
              }
            : m
        )
      );
      toast.success("Team member details updated.");
    } else {
      // Create new
      const newMem: Member = {
        id: String(Date.now()),
        name: formState.name,
        designation: formState.designation,
        panelYear: formState.panelYear,
        isModerator: formState.isModerator,
        isVisible: true,
      };
      setMembers([...members, newMem]);
      toast.success("New team member added.");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Team member removed.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Executive Team & Moderator
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage committee members, moderators, and panel year assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
              <th className="p-3.5 border-b border-[#D5CEBC]">Member Name</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Designation</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Panel Year</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
              <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEADB]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[#F5F1E6] transition-colors">
                <td className="p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1A1614] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-[#1A1614] block">
                      {m.name}
                    </span>
                    {m.isModerator && (
                      <span className="text-[10px] font-bold text-[#A81818] uppercase">
                        Faculty Moderator
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3.5 font-semibold text-[#1A1614]">{m.designation}</td>
                <td className="p-3.5 font-mono text-[#6E685E]">{m.panelYear}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => toggleVisibility(m.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      m.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {m.isVisible ? "VISIBLE" : "HIDDEN"}
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditModal(m)}
                      className="p-1.5 text-[#1A1614] hover:bg-[#EFEADB] rounded cursor-pointer transition-colors"
                      title="Edit Member Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {!m.isModerator && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Member Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            {editingMember ? "Update Team Member" : "Add Executive Committee Member"}
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Full Name <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mahir Faisal"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Designation / Role <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Assistant General Secretary"
              value={formState.designation}
              onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Panel Year
              </label>
              <input
                type="text"
                required
                placeholder="2025-26"
                value={formState.panelYear}
                onChange={(e) => setFormState({ ...formState, panelYear: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-medium"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.isModerator}
                  onChange={(e) => setFormState({ ...formState, isModerator: e.target.checked })}
                  className="w-4 h-4 rounded text-[#A81818]"
                />
                <span className="text-xs font-bold text-[#1A1614] uppercase">
                  Faculty Moderator
                </span>
              </label>
            </div>
          </div>

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
              {editingMember ? "Update Member" : "Save Member"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
