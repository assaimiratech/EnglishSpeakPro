import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "../components/common/AdminRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Topics from "../pages/admin/Topics";
import Lessons from "../pages/admin/Lessons";
import Settings from "../pages/admin/Settings";
import PremiumRequests from "../pages/admin/PremiumRequests";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
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
        path="topics"
        element={
          <AdminRoute>
            <AdminLayout>
              <Topics />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="lessons"
        element={
          <AdminRoute>
            <AdminLayout>
              <Lessons />
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
