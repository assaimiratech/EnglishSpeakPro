import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "./AdminRoute";

import Users from "../pages/admin/Users";
import Lessons from "../pages/admin/Lessons";
import Settings from "../pages/admin/Settings";
import PremiumRequests from "../pages/admin/PremiumRequests";
import Content from "../pages/admin/Content";
import Dashboard from "../pages/admin/Dashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="users"
        element={
          <AdminRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="content"
        element={
          <AdminRoute>
            <AdminLayout>
              <Content />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="settings"
        element={
          <AdminRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="premium"
        element={
          <AdminRoute>
            <AdminLayout>
              <PremiumRequests />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
