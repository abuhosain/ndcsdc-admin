import { useState } from "react";
import { Plus, Trash2, ExternalLink, Pencil, Lock } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface PartnerItem {
  id: string;
  name: string;
  tier: "WEBSITE" | "TITLE" | "GOLD" | "SILVER" | "SUPPORT";
  websiteUrl: string;
  logo: string;
  isVisible: boolean;
  isProtected?: boolean;
}

const INITIAL_PARTNERS: PartnerItem[] = [
  { id: "1", name: "NeexG", tier: "WEBSITE", websiteUrl: "https://neexg.com", logo: "/logos/NEEXG PP5.jpg", isVisible: true, isProtected: true },
  { id: "2", name: "Notre Dame College", tier: "TITLE", websiteUrl: "https://ndc.edu.bd", logo: "/logos/ndc-college-logo.jpeg", isVisible: true },
  { id: "3", name: "BUET Mentors Circle", tier: "GOLD", websiteUrl: "", logo: "", isVisible: true },
  { id: "4", name: "IBA DU Alumni Guild", tier: "GOLD", websiteUrl: "", logo: "", isVisible: true },
  { id: "5", name: "British Council", tier: "SILVER", websiteUrl: "", logo: "", isVisible: true },
];

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    tier: "GOLD" as PartnerItem["tier"],
    websiteUrl: "",
  });

  const openAddModal = () => {
    setEditingPartner(null);
    setFormState({ name: "", tier: "GOLD", websiteUrl: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PartnerItem) => {
    if (p.isProtected || p.name.toLowerCase() === "neexg" || p.tier === "WEBSITE") {
      toast.error("NeexG is the official website partner and cannot be modified.");
      return;
    }
    setEditingPartner(p);
    setFormState({
      name: p.name,
      tier: p.tier,
      websiteUrl: p.websiteUrl,
    });
    setIsModalOpen(true);
  };

  const toggleVisibility = (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (target?.isProtected || target?.name.toLowerCase() === "neexg") {
      toast.error("NeexG website partner visibility is permanent and cannot be disabled.");
      return;
    }
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p))
    );
    toast.success("Partner visibility updated.");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    if (formState.name.toLowerCase().includes("neexg") && !editingPartner?.isProtected) {
      toast.error("NeexG is already configured as the protected website partner.");
      return;
    }

    if (editingPartner) {
      setPartners((prev) =>
        prev.map((p) =>
          p.id === editingPartner.id
            ? {
                ...p,
                name: formState.name,
                tier: formState.tier,
                websiteUrl: formState.websiteUrl,
              }
            : p
        )
      );
      toast.success("Partner details updated.");
    } else {
      const newPartner: PartnerItem = {
        id: String(Date.now()),
        name: formState.name,
        tier: formState.tier,
        websiteUrl: formState.websiteUrl,
        logo: "",
        isVisible: true,
      };
      setPartners([...partners, newPartner]);
      toast.success("Partner added.");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (target?.isProtected || target?.name.toLowerCase() === "neexg") {
      toast.error("NeexG is the official website partner and cannot be deleted.");
      return;
    }
    setPartners((prev) => prev.filter((p) => p.id !== id));
    toast.success("Partner deleted.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Partners & Sponsors Manager
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage partner logos, tier classifications, and website partner deliverables
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>

      {/* Website Partner Dedicated Status Card */}
      <div className="p-6 bg-white border-2 border-[#A81818] rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#1A1614] p-1 border border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/logos/NEEXG PP5.jpg" alt="NeexG" className="w-full h-full object-cover rounded" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] block">
                Official Website Partner
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.2 bg-neutral-100 text-neutral-600 rounded border border-neutral-300">
                <Lock className="w-2.5 h-2.5" />
                Permanent Partner
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1614] mt-0.5">
              NeexG
            </h3>
            <p className="text-xs text-[#6E685E]">
              Protected partner tier per proposal agreement. Backlink: <a href="https://neexg.com" target="_blank" rel="noreferrer" className="text-[#A81818] hover:underline">https://neexg.com</a>
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
          Tier 01 &bull; Active in Footer & Home
        </div>
      </div>

      {/* Partner Table */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
              <th className="p-3.5 border-b border-[#D5CEBC]">Partner Name</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Tier</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Website Link</th>
              <th className="p-3.5 border-b border-[#D5CEBC]">Visibility</th>
              <th className="p-3.5 border-b border-[#D5CEBC] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEADB]">
            {partners.map((p) => {
              const isNeexG = p.isProtected || p.name.toLowerCase() === "neexg" || p.tier === "WEBSITE";
              return (
                <tr key={p.id} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#1A1614]">{p.name}</span>
                      {isNeexG && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-300">
                          <Lock className="w-2.5 h-2.5" />
                          Locked
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      isNeexG ? "bg-[#1A1614] text-white" : "bg-[#EFEADB] text-[#1A1614]"
                    }`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#6E685E]">
                    {p.websiteUrl ? (
                      <a href={p.websiteUrl} target="_blank" rel="noreferrer" className="text-[#A81818] hover:underline inline-flex items-center gap-1">
                        <span>{p.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3.5">
                    {isNeexG ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        PERMANENT
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleVisibility(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          p.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {p.isVisible ? "ACTIVE" : "PAUSED"}
                      </button>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {isNeexG ? (
                      <span className="text-[10px] font-semibold text-neutral-400 italic">
                        Contract Locked
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-[#1A1614] hover:bg-[#EFEADB] rounded cursor-pointer transition-colors"
                          title="Edit Partner"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Partner Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            {editingPartner ? "Update Partner / Sponsor" : "Add Partner / Sponsor"}
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Organization / Brand Name <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grameenphone / Daily Star"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Sponsorship Tier
            </label>
            <select
              value={formState.tier}
              onChange={(e) => setFormState({ ...formState, tier: e.target.value as any })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="TITLE">Title Partner</option>
              <option value="GOLD">Gold Sponsor</option>
              <option value="SILVER">Silver Sponsor</option>
              <option value="SUPPORT">Supporting Partner</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formState.websiteUrl}
              onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs font-medium"
            />
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
              {editingPartner ? "Update Partner" : "Save Partner"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
