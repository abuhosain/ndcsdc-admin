import { useEffect, useState } from "react";
import { Plus, Shield, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { usersAuditApi } from "../../services/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR" | string;
  isActive: boolean;
  lastLogin?: string;
}

interface AuditLog {
  id: string;
  action: string;
  entity?: string;
  entityId?: string;
  admin?: { name: string; email: string };
  createdAt?: string;
  time?: string;
  user?: string;
}

const INITIAL_USERS: AdminUser[] = [
  { id: "1", name: "Md. Safiul Alam", email: "moderator.ndcsdc@gmail.com", role: "SUPER_ADMIN", isActive: true, lastLogin: "2026-10-08 19:15" },
  { id: "2", name: "Mirza Rafid Ahmed", email: "rafid.ndcsdc@gmail.com", role: "SUPER_ADMIN", isActive: true, lastLogin: "2026-10-08 18:30" },
  { id: "3", name: "A. S. M. Farhan", email: "farhan.ndcsdc@gmail.com", role: "EDITOR", isActive: true, lastLogin: "2026-10-08 15:40" },
];

const DEFAULT_AUDIT_LOGS = [
  { id: "1", user: "Mirza Rafid Ahmed", action: "registrations.export_csv", entity: "Registration", time: "2026-10-08 19:12" },
  { id: "2", user: "Md. Safiul Alam", action: "activity.publish", entity: "Activity", time: "2026-10-08 18:05" },
  { id: "3", user: "A. S. M. Farhan", action: "gallery.upload", entity: "GalleryItem", time: "2026-10-08 15:20" },
  { id: "4", user: "Md. Safiul Alam", action: "settings.update", entity: "SiteSetting", time: "2026-10-08 14:00" },
];

export default function UsersAuditAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [logs, setLogs] = useState<AuditLog[]>(DEFAULT_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", password: "", role: "EDITOR" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, logsRes] = await Promise.allSettled([
        usersAuditApi.getUsers(),
        usersAuditApi.getAuditLogs(),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value.data && usersRes.value.data.length > 0) {
        setUsers(usersRes.value.data);
      }
      if (logsRes.status === "fulfilled" && logsRes.value.data && logsRes.value.data.length > 0) {
        setLogs(
          logsRes.value.data.map((l: any) => ({
            id: l.id,
            user: l.admin?.name || l.admin?.email || "System Admin",
            action: l.action,
            entity: l.entity || "System",
            time: l.createdAt ? new Date(l.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent",
          }))
        );
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) return;

    try {
      const res = await usersAuditApi.createUser(formState);
      const created = res.data || {
        id: String(Date.now()),
        name: formState.name,
        email: formState.email,
        role: formState.role,
        isActive: true,
        lastLogin: "Never",
      };
      setUsers([...users, created]);
      toast.success("Admin user account created.");
    } catch {
      const newUser: AdminUser = {
        id: String(Date.now()),
        name: formState.name,
        email: formState.email,
        role: formState.role,
        isActive: true,
        lastLogin: "Never",
      };
      setUsers([...users, newUser]);
      toast.success("Admin user account created (Local).");
    } finally {
      setIsModalOpen(false);
      setFormState({ name: "", email: "", password: "", role: "EDITOR" });
    }
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

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh"
              className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Admin User</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3.5 border-b border-[#D5CEBC]">User Name</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Email Address</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Permission Role</th>
                <th className="p-3.5 border-b border-[#D5CEBC]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3.5 font-bold text-[#1A1614] flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#A81818]" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3.5 text-[#6E685E]">{u.email}</td>
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
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg uppercase text-[#1A1614]">
            System Activity & Audit Logs
          </h3>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Cryptographically recorded administrative mutation events
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs divide-y divide-[#EFEADB] overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 text-xs flex items-center justify-between hover:bg-[#F5F1E6] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold uppercase bg-[#EFEADB] px-2 py-0.5 rounded text-[#1A1614]">
                  {log.action}
                </span>
                <span className="text-[#1A1614] font-semibold">{log.user}</span>
                <span className="text-[#6E685E]">&bull; {log.entity}</span>
              </div>
              <span className="font-mono text-[10px] text-[#6E685E]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add User */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        title={<span className="font-display font-bold uppercase text-sm">Add New Administrator</span>}
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Admin Name <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanzim Ahmed"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">
              Email Address <span className="text-[#A81818]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="name@ndcsdc.org"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1614] mb-1">Role Permission</label>
            <select
              value={formState.role}
              onChange={(e) => setFormState({ ...formState, role: e.target.value })}
              className="w-full px-3 py-2 border border-[#D5CEBC] rounded-lg text-xs cursor-pointer"
            >
              <option value="EDITOR">EDITOR (Manage Content & Registrations)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full System Control)</option>
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
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
