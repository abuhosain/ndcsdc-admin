import { useEffect, useState } from "react";
import { Plus, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { galleryApi } from "../../services/api";

interface PhotoItem {
  id: string;
  category: string;
  title: string;
  imageUrl?: string;
  caption?: string;
  uploadedAt?: string;
}

const INITIAL_PHOTOS: PhotoItem[] = [
  { id: "1", category: "Study Fair 2025", title: "Main Hall Opening Assembly", caption: "Students gathering at Notre Dame College Auditorium.", uploadedAt: "2025-11-16" },
  { id: "2", category: "Workshops", title: "IBA Analytical Masterclass Board Session", caption: "Live mathematics problem solving demonstration.", uploadedAt: "2026-01-21" },
  { id: "3", category: "Workshops", title: "BUET Engineering Problem Solving", caption: "Students solving speed numerical drills.", uploadedAt: "2026-03-11" },
  { id: "4", category: "Executive", title: "NDCSDC Executive Strategy Meeting", caption: "Moderator and student leaders preparing summit logistics.", uploadedAt: "2026-04-05" },
];

export default function GalleryAdminPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [loading, setLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({ category: "Workshops", title: "", caption: "", imageUrl: "" });

  const loadGallery = async () => {
    try {
      setLoading(true);
      const res = await galleryApi.getAdminGallery();
      if (res.data && res.data.length > 0) {
        setPhotos(
          res.data.map((p: any) => ({
            id: p.id,
            category: p.category || "General",
            title: p.title,
            imageUrl: p.imageUrl,
            caption: p.caption || p.title,
            uploadedAt: p.createdAt ? p.createdAt.slice(0, 10) : "Recent",
          }))
        );
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const filteredPhotos = selectedAlbum === "ALL"
    ? photos
    : photos.filter((p) => p.category?.toLowerCase() === selectedAlbum.toLowerCase());

  const openAddModal = () => {
    setFormState({ category: "Workshops", title: "", caption: "", imageUrl: "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    try {
      const res = await galleryApi.createGalleryPhoto({
        title: formState.title,
        category: formState.category,
        caption: formState.caption,
        imageUrl: formState.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      });
      const created = res.data || {
        id: String(Date.now()),
        ...formState,
        uploadedAt: new Date().toISOString().slice(0, 10),
      };
      setPhotos([created, ...photos]);
      toast.success("Photo added to gallery album.");
    } catch {
      const newPhoto: PhotoItem = {
        id: String(Date.now()),
        ...formState,
        uploadedAt: new Date().toISOString().slice(0, 10),
      };
      setPhotos([newPhoto, ...photos]);
      toast.success("Photo added to gallery album (Local).");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await galleryApi.deleteGalleryPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo removed.");
    } catch {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo removed (Local).");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Media & Photo Gallery
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Campus moments, workshop archives, and executive sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGallery}
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
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Album Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "Study Fair 2025", "Workshops", "Executive"].map((album) => (
          <button
            key={album}
            onClick={() => setSelectedAlbum(album)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              selectedAlbum === album
                ? "bg-[#1A1614] text-white"
                : "bg-white text-[#6E685E] border border-[#D5CEBC] hover:text-[#1A1614]"
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-[#EFEADB] flex items-center justify-center relative overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-[#B9B29E]" />
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#1A1614]/80 text-white text-[9px] font-bold uppercase backdrop-blur-xs">
                {p.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-xs uppercase text-[#1A1614] line-clamp-1 mb-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-[#6E685E] line-clamp-2 leading-relaxed">
                  {p.caption}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFEADB] mt-3 flex items-center justify-between text-[10px] text-[#6E685E]">
                <span>{p.uploadedAt}</span>
                <button
                  onClick={() => handleDelete(p.id)}
                  title="Delete Photo"
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
        title={<span className="font-display font-bold uppercase text-sm">Add Photo Record</span>}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Album Category</label>
            <select
              value={formState.category}
              onChange={(e) => setFormState({ ...formState, category: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
            >
              <option value="Study Fair 2025">Study Fair 2025</option>
              <option value="Workshops">Workshops</option>
              <option value="Executive">Executive</option>
              <option value="Campus Moments">Campus Moments</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Photo Title <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Opening Keynote Session"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formState.imageUrl}
              onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Caption</label>
            <textarea
              rows={3}
              placeholder="Brief description of the photo..."
              value={formState.caption}
              onChange={(e) => setFormState({ ...formState, caption: e.target.value })}
              className="w-full p-3 border border-[#D5CEBC] rounded-lg text-xs"
            ></textarea>
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
              Save Photo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
