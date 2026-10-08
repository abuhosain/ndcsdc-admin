import { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface PartnerItem {
  id: string;
  name: string;
  tier: "WEBSITE" | "TITLE" | "GOLD" | "SILVER" | "SUPPORT";
  websiteUrl: string;
  logo: string;
  isVisible: boolean;
}

const INITIAL_PARTNERS: PartnerItem[] = [
  { id: "1", name: "NeexG", tier: "WEBSITE", websiteUrl: "https://neexg.com", logo: "/logos/NEEXG PP5.jpg", isVisible: true },
  { id: "2", name: "Notre Dame College", tier: "TITLE", websiteUrl: "https://ndc.edu.bd", logo: "/logos/ndc-college-logo.jpeg", isVisible: true },
  { id: "3", name: "BUET Mentors Circle", tier: "GOLD", websiteUrl: "", logo: "", isVisible: true },
  { id: "4", name: "IBA DU Alumni Guild", tier: "GOLD", websiteUrl: "", logo: "", isVisible: true },
  { id: "5", name: "British Council", tier: "SILVER", websiteUrl: "", logo: "", isVisible: true },
];

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", tier: "GOLD" as any, websiteUrl: "" });

  const toggleVisibility = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVisible: !p.isVisible } : p))
    );
    toast.success("Partner visibility updated.");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    const newPartner: PartnerItem = {
      id: String(Date.now()),
      name: formState.name,
      tier: formState.tier,
      websiteUrl: formState.websiteUrl,
      logo: "",
      isVisible: true,
    };

    setPartners([...partners, newPartner]);
    setIsModalOpen(false);
    setFormState({ name: "", tier: "GOLD", websiteUrl: "" });
    toast.success("Partner added.");
  };

  const handleDelete = (id: string) => {
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
          onClick={() => setIsModalOpen(true)}
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] block">
              Official Website Partner
            </span>
            <h3 className="font-display font-bold text-lg text-[#1A1614]">
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
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-[#F5F1E6] transition-colors">
                <td className="p-3.5 font-display font-bold text-sm text-[#1A1614]">{p.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-[#EFEADB] text-[#1A1614] font-bold uppercase text-[10px]">
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
                  <button
                    onClick={() => toggleVisibility(p.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      p.isVisible ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {p.isVisible ? "VISIBLE" : "HIDDEN"}
                  </button>
                </td>
                <td className="p-3.5 text-right">
                  {p.tier !== "WEBSITE" && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Add Partner / Sponsor
          </span>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Partner Name</label>
            <input
              type="text"
              required
              placeholder="e.g. British Council"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Partner Tier</label>
            <select
              value={formState.tier}
              onChange={(e) => setFormState({ ...formState, tier: e.target.value as any })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold"
            >
              <option value="TITLE">TITLE</option>
              <option value="GOLD">GOLD</option>
              <option value="SILVER">SILVER</option>
              <option value="SUPPORT">SUPPORT</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Website URL</label>
            <input
              type="url"
              placeholder="https://partner-website.com"
              value={formState.websiteUrl}
              onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
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
              Save Partner
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
