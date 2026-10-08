import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

export interface Member {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  facebookUrl: string;
  panelYear: string;
  isModerator: boolean;
  isVisible: boolean;
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
  {
    id: "7",
    name: "Nabil Chowdhury",
    designation: "Director of Operations",
    phone: "+880 1716-789012",
    email: "operations.ndcsdc@gmail.com",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
    isVisible: true,
  },
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
    facebookUrl: "https://facebook.com",
    panelYear: "2025-26",
    isModerator: false,
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormState({
      name: "",
      designation: "",
      phone: "+880 ",
      email: "",
      facebookUrl: "https://facebook.com",
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
      phone: m.phone || "",
      email: m.email || "",
      facebookUrl: m.facebookUrl || "https://facebook.com",
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
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formState.name,
                designation: formState.designation,
                phone: formState.phone,
                email: formState.email,
                facebookUrl: formState.facebookUrl,
                panelYear: formState.panelYear,
                isModerator: formState.isModerator,
              }
            : m
        )
      );
      toast.success("Executive member updated successfully.");
    } else {
      const newMem: Member = {
        id: String(Date.now()),
        name: formState.name,
        designation: formState.designation,
        phone: formState.phone,
        email: formState.email,
        facebookUrl: formState.facebookUrl,
        panelYear: formState.panelYear,
        isModerator: formState.isModerator,
        isVisible: true,
      };
      setMembers([...members, newMem]);
      toast.success("New executive member added.");
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
            Executive Team & Moderator Management
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage committee members, contact cards, designations, phone, email & Facebook profiles
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3.5 border-b border-[#D5CEBC]">Member Details</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Designation</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Contact (Phone & Email)</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Panel Year</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
                <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#1A1614] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm text-[#1A1614] block">
                          {m.name}
                        </span>
                        {m.isModerator ? (
                          <span className="text-[10px] font-bold text-[#A81818] uppercase">
                            Faculty Moderator
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#6E685E]">
                            Executive Committee
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-[#1A1614]">{m.designation}</td>
                  <td className="p-3.5">
                    <div className="font-mono text-[#1A1614] text-xs">{m.phone}</div>
                    <div className="text-[11px] text-[#6E685E] truncate max-w-[180px]">{m.email}</div>
                  </td>
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
                        title="Edit Member Contact & Role"
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
      </div>

      {/* Add / Edit Member Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={560}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            {editingMember ? "Update Executive Contact & Role" : "Add Executive Committee Member"}
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Full Name <span className="text-[#A81818]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mirza Rafid Ahmed"
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
                placeholder="e.g. General Secretary"
                value={formState.designation}
                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+880 1711-234567"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Official Email
              </label>
              <input
                type="email"
                placeholder="rafid.ndcsdc@gmail.com"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Facebook Profile Link
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/username"
                value={formState.facebookUrl}
                onChange={(e) => setFormState({ ...formState, facebookUrl: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs"
              />
            </div>

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
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.isModerator}
                onChange={(e) => setFormState({ ...formState, isModerator: e.target.checked })}
                className="w-4 h-4 rounded text-[#A81818]"
              />
              <span className="text-xs font-bold text-[#1A1614] uppercase">
                Faculty Moderator Flag
              </span>
            </label>
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
