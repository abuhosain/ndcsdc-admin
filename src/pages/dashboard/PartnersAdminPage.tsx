import { useEffect, useState } from "react";
import { Plus, Trash2, ExternalLink, Pencil, Lock, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { partnersApi } from "../../services/api";

interface PartnerItem {
  id: string;
  name: string;
  tier: "WEBSITE" | "TITLE" | "GOLD" | "SILVER" | "SUPPORT" | string;
  websiteUrl?: string;
  logo?: string;
  logoUrl?: string;
  isVisible?: boolean;
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
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    tier: "GOLD",
    websiteUrl: "",
  });

  const loadPartners = async () => {
    try {
      setLoading(true);
      const res = await partnersApi.getAdminPartners();
      if (res.data && res.data.length > 0) {
        setPartners(res.data);
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

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
      websiteUrl: p.websiteUrl || p.logoUrl || "",
    });
    setIsModalOpen(true);
  };

  const toggleVisibility = async (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (target?.isProtected || target?.name.toLowerCase() === "neexg") {
      toast.error("NeexG website partner visibility is permanent and cannot be disabled.");
      return;
    }
    const nextVis = target?.isVisible === false;
    try {
      await partnersApi.updatePartner(id, { isVisible: nextVis });
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isVisible: nextVis } : p))
      );
      toast.success("Partner visibility updated.");
    } catch {
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isVisible: nextVis } : p))
      );
      toast.success("Partner visibility updated (Local).");
    }
  };

  const handleDelete = async (id: string) => {
    const target = partners.find((p) => p.id === id);
    if (target?.isProtected || target?.name.toLowerCase() === "neexg") {
      toast.error("Protected website partner cannot be deleted.");
      return;
    }
    try {
      await partnersApi.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      toast.success("Partner deleted.");
    } catch {
      setPartners((prev) => prev.filter((p) => p.id !== id));
      toast.success("Partner deleted (Local).");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;

    try {
      if (editingPartner) {
        await partnersApi.updatePartner(editingPartner.id, formState);
        setPartners((prev) =>
          prev.map((p) => (p.id === editingPartner.id ? { ...p, ...formState } : p))
        );
        toast.success("Partner updated successfully.");
      } else {
        const res = await partnersApi.createPartner(formState);
        const created = res.data || { id: String(Date.now()), ...formState, isVisible: true };
        setPartners((prev) => [...prev, created]);
        toast.success("New sponsor partner added.");
      }
    } catch {
      if (editingPartner) {
        setPartners((prev) =>
          prev.map((p) => (p.id === editingPartner.id ? { ...p, ...formState } : p))
        );
      } else {
        setPartners((prev) => [...prev, { id: String(Date.now()), ...formState, isVisible: true }]);
      }
      toast.success("Partner saved (Local).");
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
            Partners & Sponsors Management
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Manage official summit sponsors, website partner credit, and partner logos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPartners}
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
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => {
          const isNeexG = p.isProtected || p.name.toLowerCase() === "neexg" || p.tier === "WEBSITE";
          return (
            <div
              key={p.id}
              className={`p-6 rounded-xl border shadow-xs flex flex-col justify-between ${
                isNeexG ? "bg-[#1A1614] text-white border-neutral-800" : "bg-white border-[#D5CEBC]"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      isNeexG
                        ? "bg-[#E8C547] text-[#1A1614]"
                        : "bg-[#F5F1E6] text-[#6E685E]"
                    }`}
                  >
                    {p.tier} Tier
                  </span>

                  {isNeexG ? (
                    <span className="text-[10px] font-bold text-neutral-400 inline-flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#E8C547]" /> Permanent Credit
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleVisibility(p.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        p.isVisible !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {p.isVisible !== false ? "Visible" : "Hidden"}
                    </button>
                  )}
                </div>

                <h3
                  className={`font-display font-bold text-lg uppercase ${
                    isNeexG ? "text-white" : "text-[#1A1614]"
                  }`}
                >
                  {p.name}
                </h3>
                {isNeexG && (
                  <p className="text-xs text-neutral-300 mt-1">
                    Official Website Partner &bull; Designed & Developed by NeexG
                  </p>
                )}
              </div>

              <div
                className={`pt-3 border-t mt-4 flex items-center justify-between text-xs ${
                  isNeexG ? "border-neutral-800" : "border-[#EFEADB]"
                }`}
              >
                {p.websiteUrl ? (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-bold inline-flex items-center gap-1 hover:underline ${
                      isNeexG ? "text-[#E8C547]" : "text-[#A81818]"
                    }`}
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#6E685E]">No website URL</span>
                )}

                {!isNeexG && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      title="Edit Partner"
                      className="p-1.5 text-[#6E685E] hover:text-[#1A1614] hover:bg-[#EFEADB] rounded transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete Partner"
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title={
          <span className="font-display font-bold uppercase text-sm">
            {editingPartner ? "Edit Partner" : "Add Sponsor Partner"}
          </span>
        }
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Partner Organization Name <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. British Council Bangladesh"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Sponsorship Tier</label>
            <select
              value={formState.tier}
              onChange={(e) => setFormState({ ...formState, tier: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
            >
              <option value="TITLE">TITLE SPONSOR</option>
              <option value="GOLD">GOLD SPONSOR</option>
              <option value="SILVER">SILVER SPONSOR</option>
              <option value="MEDIA">MEDIA PARTNER</option>
              <option value="SUPPORT">STRATEGIC SUPPORT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Website URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={formState.websiteUrl}
              onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
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
              {editingPartner ? "Update Partner" : "Add Partner"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
