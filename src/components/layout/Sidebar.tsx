import { Layout, Menu } from "antd";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  Image as ImageIcon,
  UserCheck,
  Handshake,
  Mail,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const { Sider } = Layout;

const sidebarItems = [
  {
    key: "/dashboard",
    label: <Link to="/dashboard" className="text-sm font-semibold">Dashboard</Link>,
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    key: "/dashboard/registrations",
    label: <Link to="/dashboard/registrations" className="text-sm font-semibold">Registrations</Link>,
    icon: <UserCheck className="w-4 h-4" />,
  },
  {
    key: "/dashboard/summit",
    label: <Link to="/dashboard/summit" className="text-sm font-semibold">Summit NACS 2026</Link>,
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    key: "/dashboard/activities",
    label: <Link to="/dashboard/activities" className="text-sm font-semibold">Activities</Link>,
    icon: <Layers className="w-4 h-4" />,
  },
  {
    key: "/dashboard/gallery",
    label: <Link to="/dashboard/gallery" className="text-sm font-semibold">Photo Gallery</Link>,
    icon: <ImageIcon className="w-4 h-4" />,
  },
  {
    key: "/dashboard/team",
    label: <Link to="/dashboard/team" className="text-sm font-semibold">Executive Team</Link>,
    icon: <Users className="w-4 h-4" />,
  },
  {
    key: "/dashboard/partners",
    label: <Link to="/dashboard/partners" className="text-sm font-semibold">Partners & Sponsors</Link>,
    icon: <Handshake className="w-4 h-4" />,
  },
  {
    key: "/dashboard/messages",
    label: <Link to="/dashboard/messages" className="text-sm font-semibold">Messages Inbox</Link>,
    icon: <Mail className="w-4 h-4" />,
  },
  {
    key: "/dashboard/settings",
    label: <Link to="/dashboard/settings" className="text-sm font-semibold">Site Settings</Link>,
    icon: <Settings className="w-4 h-4" />,
  },
  {
    key: "/dashboard/users",
    label: <Link to="/dashboard/users" className="text-sm font-semibold">Admin Users & Audit</Link>,
    icon: <ShieldAlert className="w-4 h-4" />,
  },
];

export default function Sidebar({
  minimizeSidebar,
  setMinimizeSidebar,
}: {
  minimizeSidebar: boolean;
  setMinimizeSidebar: (value: boolean) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ndcsdc_auth");
    navigate("/login");
  };

  return (
    <Sider
      collapsible
      collapsed={minimizeSidebar}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={76}
      style={{ backgroundColor: "#1A1614" }}
      className="border-r border-neutral-800 bg-[#1A1614] min-h-screen"
      width={260}
    >
      <div className="flex flex-col h-full z-50">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-neutral-700">
              <img
                src="/logos/ndcsdc-logo.jpeg"
                alt="NDCSDC"
                className="w-full h-full object-contain"
              />
            </div>
            {!minimizeSidebar && (
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm uppercase text-white tracking-wider">
                  NDCSDC Admin
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">
                  NACS 2026 Portal
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setMinimizeSidebar(!minimizeSidebar)}
            className="p-1.5 rounded-md bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            {minimizeSidebar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={sidebarItems}
            style={{
              borderRight: 0,
              background: "transparent",
            }}
            className="border-none space-y-1"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-neutral-800/80 space-y-2">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-md transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            {!minimizeSidebar && <span>View Public Website</span>}
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!minimizeSidebar && <span>Sign Out</span>}
          </button>
        </div>

      </div>
    </Sider>
  );
}
