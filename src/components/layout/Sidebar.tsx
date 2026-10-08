import { Layout, Menu } from "antd";
import { Calendar, ChevronLeft, ChevronRight, GraduationCap, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";

const { Sider } = Layout;

const sidebarItems = [
    {
        key: "/dashboard",
        label: <Link to="/dashboard" className="text-sm font-medium">Dashboard</Link>,
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        key: "/dashboard/projects",
        label: <Link to="/dashboard/projects" className="text-sm font-medium">Projects</Link>,
        icon: <Calendar className="w-5 h-5" />,
    },
    {
        key: "/dashboard/experiences",
        label: <Link to="/dashboard/experiences" className="text-sm font-medium">Experiences</Link>,
        icon: <GraduationCap className="w-5 h-5" />,
    },
];

export default function Sidebar({ minimizeSidebar, setMinimizeSidebar, openKeys, onOpenChange }: { minimizeSidebar: boolean, setMinimizeSidebar: (value: boolean) => void, openKeys: string[], onOpenChange: (keys: string[]) => void }) {
    const location = useLocation();

    return (
        <Sider
            collapsible
            collapsed={minimizeSidebar}
            trigger={null}
            breakpoint="lg"
            collapsedWidth={80}
            style={{ backgroundColor: "#020617" }}
            className="border-r border-slate-800 bg-slate-950"
            width={280}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    zIndex: "9999",
                }}>
                {/* logo and close button */}
                <div
                    className="flex justify-between items-center relative"
                    style={{ padding: "20px 16px" }}>
                    {minimizeSidebar ? (
                        <div className="text-xl font-extrabold text-white tracking-wider mx-auto">
                            .O<span className="text-indigo-500">S</span>
                        </div>
                    ) : (
                        <div className="text-xl font-bold tracking-tight text-white">
                            Portfolio<span className="text-indigo-400 font-extrabold">.OS</span>
                        </div>
                    )}

                    <button
                        onClick={() => setMinimizeSidebar(!minimizeSidebar)}
                        className={`flex justify-center items-center bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 w-7 h-7 rounded-lg cursor-pointer transition-colors absolute top-5 ${minimizeSidebar ? "-right-3.5 shadow-lg shadow-black/50" : "right-4"
                            }`}>
                        {minimizeSidebar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* separator */}
                <div style={{ padding: "0px 16px" }}>
                    <div className="w-full h-[1px] bg-slate-800/80" />
                </div>

                <div
                    className="relative"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        marginTop: "16px",
                        padding: "0 12px",
                    }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={sidebarItems}
                        style={{
                            borderRight: 0,
                            background: "transparent",
                        }}
                        className="border-none space-y-1 custom-dark-menu"
                        expandIcon={false}
                        inlineCollapsed={minimizeSidebar}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                    />

                    {/* settings button */}
                    <div className="overflow-hidden absolute bottom-5 left-4 right-4 pt-5 border-t border-slate-800/80">
                        {!minimizeSidebar ? (
                            <div className="mx-3 space-y-2">
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 transition-all rounded-xl border border-transparent hover:border-slate-800 text-sm font-medium">
                                    <Settings className="w-5 h-5" />
                                    Settings
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 transition-all rounded-xl border border-transparent hover:border-slate-800 text-sm font-medium">
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mx-1 space-y-2">
                                <button
                                    className="w-full flex items-center justify-center p-2.5 cursor-pointer text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 transition-all rounded-xl border border-transparent hover:border-slate-800">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button
                                    className="w-full flex items-center justify-center p-2.5 cursor-pointer text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 transition-all rounded-xl border border-transparent hover:border-slate-800">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Sider>
    )
}
