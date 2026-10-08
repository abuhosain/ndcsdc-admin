import { useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface PhotoItem {
  id: string;
  album: string;
  title: string;
  caption: string;
  uploadedAt: string;
}

const INITIAL_PHOTOS: PhotoItem[] = [
  { id: "1", album: "Study Fair 2025", title: "Main Hall Opening Assembly", caption: "Students gathering at Notre Dame College Auditorium.", uploadedAt: "2025-11-16" },
  { id: "2", album: "Workshops", title: "IBA Analytical Masterclass Board Session", caption: "Live mathematics problem solving demonstration.", uploadedAt: "2026-01-21" },
  { id: "3", album: "Workshops", title: "BUET Engineering Problem Solving", caption: "Students solving speed numerical drills.", uploadedAt: "2026-03-11" },
  { id: "4", album: "Executive", title: "NDCSDC Executive Strategy Meeting", caption: "Moderator and student leaders preparing summit logistics.", uploadedAt: "2026-04-05" },
];

export default function GalleryAdminPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [selectedAlbum, setSelectedAlbum] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ album: "Study Fair 2025", title: "", caption: "" });

  const filteredPhotos = selectedAlbum === "ALL"
    ? photos
    : photos.filter((p) => p.album === selectedAlbum);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    const newPhoto: PhotoItem = {
      id: String(Date.now()),
      ...formState,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    setPhotos([newPhoto, ...photos]);
    setIsModalOpen(false);
    setFormState({ album: "Study Fair 2025", title: "", caption: "" });
    toast.success("Photo added to gallery album.");
  };

  const handleDelete = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    toast.success("Photo removed.");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Photo Gallery & Albums
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Organize campus photo albums and event imagery
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image / Caption</span>
        </button>
      </div>

      {/* Album Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "Study Fair 2025", "Workshops", "Executive"].map((alb) => (
          <button
            key={alb}
            onClick={() => setSelectedAlbum(alb)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors cursor-pointer ${
              selectedAlbum === alb
                ? "bg-[#1A1614] text-white border-[#1A1614]"
                : "bg-white text-[#6E685E] border-[#D5CEBC] hover:border-[#1A1614]"
            }`}
          >
            {alb === "ALL" ? "All Albums" : alb}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#D5CEBC] rounded-xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] bg-[#EFEADB] rounded-lg border border-[#D5CEBC] flex items-center justify-center text-[#6E685E] mb-3">
                <ImageIcon className="w-8 h-8 text-[#B8B09A]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A81818] block">
                {item.album}
              </span>
              <h4 className="font-display font-bold text-xs uppercase text-[#1A1614] mt-0.5 mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#6E685E] line-clamp-2">
                {item.caption}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EFEADB] mt-4 flex items-center justify-between text-[10px] text-[#6E685E]">
              <span>{item.uploadedAt}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-rose-700 hover:underline font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Upload to Gallery Album
          </span>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Target Album</label>
            <select
              value={formState.album}
              onChange={(e) => setFormState({ ...formState, album: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold"
            >
              <option value="Study Fair 2025">Study Fair 2025</option>
              <option value="Workshops">Workshops</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Photo Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Keynote Speech at Auditorium"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Caption</label>
            <textarea
              rows={3}
              required
              placeholder="Brief caption describing the moment..."
              value={formState.caption}
              onChange={(e) => setFormState({ ...formState, caption: e.target.value })}
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
              Save Photo
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
