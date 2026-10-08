import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR";
  isActive: boolean;
  lastLogin: string;
}

const INITIAL_USERS: AdminUser[] = [
  { id: "1", name: "Md. Safiul Alam", email: "moderator.ndcsdc@gmail.com", role: "SUPER_ADMIN", isActive: true, lastLogin: "2026-10-08 19:15" },
  { id: "2", name: "Mirza Rafid Ahmed", email: "rafid.ndcsdc@gmail.com", role: "SUPER_ADMIN", isActive: true, lastLogin: "2026-10-08 18:30" },
  { id: "3", name: "A. S. M. Farhan", email: "farhan.ndcsdc@gmail.com", role: "EDITOR", isActive: true, lastLogin: "2026-10-08 15:40" },
];

const AUDIT_LOGS = [
  { id: "1", user: "Mirza Rafid Ahmed", action: "registrations.export_csv", entity: "Registration", time: "2026-10-08 19:12" },
  { id: "2", user: "Md. Safiul Alam", action: "activity.publish", entity: "Activity", time: "2026-10-08 18:05" },
  { id: "3", user: "A. S. M. Farhan", action: "gallery.upload", entity: "GalleryItem", time: "2026-10-08 15:20" },
  { id: "4", user: "Md. Safiul Alam", action: "settings.update", entity: "SiteSetting", time: "2026-10-08 14:00" },
];

export default function UsersAuditAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", role: "EDITOR" as any });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) return;

    const newUser: AdminUser = {
      id: String(Date.now()),
      name: formState.name,
      email: formState.email,
      role: formState.role,
      isActive: true,
      lastLogin: "Never",
    };

    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormState({ name: "", email: "", role: "EDITOR" });
    toast.success("Admin user account created.");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Users Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
              Admin Users & Access Control
            </h2>
            <p className="text-xs text-[#6E685E] mt-0.5">
              Super Admin and Editor role permissions
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs uppercase tracking-wider py-2.5 px-5 font-bold inline-flex items-center gap-2 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin User</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3.5 border-b border-[#D5CEBC]">User Name</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Email</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Role</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3.5 font-display font-bold text-sm text-[#1A1614]">{u.name}</td>
                  <td className="p-3.5 font-mono text-[#4A4540]">{u.email}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#6E685E] text-[11px]">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Trail Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display font-bold text-base uppercase text-[#1A1614]">
            Live Security Audit Trail
          </h3>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Immutable log of all admin writes, exports, and status changes
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3 border-b border-[#D5CEBC]">Timestamp</th>
                <th className="p-3 border-b border-[#D5CEBC]">Admin User</th>
                <th className="p-3 border-b border-[#D5CEBC]">Action</th>
                <th className="p-3 border-b border-[#D5CEBC]">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB] text-xs">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5F1E6]">
                  <td className="p-3 font-mono text-[#6E685E]">{log.time}</td>
                  <td className="p-3 font-semibold text-[#1A1614]">{log.user}</td>
                  <td className="p-3 font-mono font-bold text-[#A81818]">{log.action}</td>
                  <td className="p-3 uppercase text-[#6E685E] text-[11px] font-bold">{log.entity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Create Admin Account
          </span>
        }
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Student Secretary"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@ndcsdc.org"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1614] uppercase mb-1">Assigned Role</label>
            <select
              value={formState.role}
              onChange={(e) => setFormState({ ...formState, role: e.target.value as any })}
              className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="EDITOR">EDITOR (Content Management Only)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full Administrative Control)</option>
            </select>
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
              Create User
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
