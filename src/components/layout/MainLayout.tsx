import { useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import { Calendar } from "lucide-react";

const { Header, Content } = Layout;

export default function MainLayout() {
  const [minimizeSidebar, setMinimizeSidebar] = useState(false);
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/registrations":
        return "Student Registrations Roster";
      case "/dashboard/summit":
        return "NACS 2026 Summit Management";
      case "/dashboard/activities":
        return "Club Activities & Events";
      case "/dashboard/gallery":
        return "Photo Gallery & Albums";
      case "/dashboard/team":
        return "Executive Panel & Moderator";
      case "/dashboard/partners":
        return "Partners & Sponsors";
      case "/dashboard/messages":
        return "Secretariat Messages Inbox";
      case "/dashboard/settings":
        return "Global Site & Event Settings";
      case "/dashboard/users":
        return "Admin Users & Audit Logs";
      default:
        return "NDCSDC Administration";
    }
  };

  return (
    <Layout hasSider className="min-h-screen bg-[#F5F1E6]">
      <Sidebar
        minimizeSidebar={minimizeSidebar}
        setMinimizeSidebar={setMinimizeSidebar}
      />

      <Layout className="bg-[#F5F1E6] min-h-screen min-w-0 flex-1 flex flex-col">
        {/* Top Header */}
        <Header
          style={{ background: "#FFFFFF", padding: "0 24px" }}
          className="border-b border-[#D5CEBC] flex items-center justify-between h-16 sticky top-0 z-40 shadow-xs"
        >
          <div>
            <h1 className="font-display font-extrabold text-base sm:text-lg uppercase text-[#1A1614] m-0">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#EFEADB] text-[#1A1614] rounded-md border border-[#D5CEBC] text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#A81818]" />
              <span>NACS 2026: 14 Nov 2026</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-[#D5CEBC]">
              <div className="w-8 h-8 rounded-full bg-[#1A1614] text-[#F5EFE0] font-display font-bold text-xs flex items-center justify-center">
                SA
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1A1614] leading-tight">
                  Super Admin
                </span>
                <span className="text-[10px] text-[#6E685E] leading-tight">
                  NDCSDC Moderator
                </span>
              </div>
            </div>
          </div>
        </Header>

        {/* Content Area */}
        <Content className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1400px] w-full mx-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}