import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import Login from "../pages/public/Login";
import NotFoundPage from "../pages/public/NotFoundPage";
import ProtectedRoute from "./protected.routes";
import DashboardOverviewPage from "../pages/dashboard/DashboardOverviewPage";
import RegistrationsPage from "../pages/dashboard/RegistrationsPage";
import SummitManagementPage from "../pages/dashboard/SummitManagementPage";
import ActivitiesAdminPage from "../pages/dashboard/ActivitiesAdminPage";
import GalleryAdminPage from "../pages/dashboard/GalleryAdminPage";
import TeamAdminPage from "../pages/dashboard/TeamAdminPage";
import PartnersAdminPage from "../pages/dashboard/PartnersAdminPage";
import MessagesAdminPage from "../pages/dashboard/MessagesAdminPage";
import SiteSettingsAdminPage from "../pages/dashboard/SiteSettingsAdminPage";
import UsersAuditAdminPage from "../pages/dashboard/UsersAuditAdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["SUPER_ADMIN", "EDITOR"]}>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardOverviewPage />,
      },
      {
        path: "/dashboard/registrations",
        element: <RegistrationsPage />,
      },
      {
        path: "/dashboard/summit",
        element: <SummitManagementPage />,
      },
      {
        path: "/dashboard/activities",
        element: <ActivitiesAdminPage />,
      },
      {
        path: "/dashboard/gallery",
        element: <GalleryAdminPage />,
      },
      {
        path: "/dashboard/team",
        element: <TeamAdminPage />,
      },
      {
        path: "/dashboard/partners",
        element: <PartnersAdminPage />,
      },
      {
        path: "/dashboard/messages",
        element: <MessagesAdminPage />,
      },
      {
        path: "/dashboard/settings",
        element: <SiteSettingsAdminPage />,
      },
      {
        path: "/dashboard/users",
        element: <UsersAuditAdminPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;