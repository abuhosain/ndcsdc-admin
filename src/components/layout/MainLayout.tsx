import { ConfigProvider, Layout, theme } from "antd";
import { Outlet, useLocation } from "react-router";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const MainLayout = () => {
    const [minimizeSidebar, setMinimizeSidebar] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const path = useLocation();
    const pathname = path.pathname;

    const onOpenChange = (keys: string[]) => {
        const latest = keys.find((key) => !openKeys.includes(key));
        setOpenKeys(latest ? [latest] : []);
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setMinimizeSidebar(true);
        }
    }, [pathname]);

    useEffect(() => {
        if (minimizeSidebar) {
            setOpenKeys([]);
        }
    }, [minimizeSidebar]);

    return (
        <Layout className="h-screen bg-slate-950 text-slate-100 font-sans">
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        fontFamily: '"Lexend", sans-serif',
                        colorPrimary: "#6366f1",
                        colorBgBase: "#020617",
                        colorBgContainer: "#0f172a",
                    },
                    components: {
                        Menu: {
                            darkItemSelectedBg: "rgba(99, 102, 241, 0.15)",
                            darkItemSelectedColor: "#818cf8",
                            darkItemColor: "#94a3b8",
                            darkItemHoverColor: "#f8fafc",
                            darkItemHoverBg: "rgba(30, 41, 59, 0.7)",
                            itemMarginInline: 8,
                            itemBorderRadius: 10,
                        },
                    },
                }}>

                <Sidebar minimizeSidebar={minimizeSidebar} setMinimizeSidebar={setMinimizeSidebar} openKeys={openKeys} onOpenChange={onOpenChange} />

                <Layout className="overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]">
                    <Content className="overflow-y-auto">
                        <div
                            style={{
                                padding: "28px",
                                minHeight: 360,
                            }}>
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </ConfigProvider>
        </Layout>
    );
};

export default MainLayout;