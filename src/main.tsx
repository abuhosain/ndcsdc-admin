import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routes/routes";
import { Toaster } from "sonner";
import { ConfigProvider } from "antd";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#A81818",
          fontFamily: '"Poppins", "Inter", sans-serif',
        },
      }}
    >
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </ConfigProvider>
  </StrictMode>
);