import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "../components/common/AdminRoute";

import Users from "../pages/admin/Users";
import Lessons from "../pages/admin/Lessons";
import Settings from "../pages/admin/Settings";
import PremiumRequests from "../pages/admin/PremiumRequests";
import Content from "../pages/admin/Content";
import Dashboard from "../pages/admin/Dashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="content" element={<Content />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="settings" element={<Settings />} />
          <Route path="premium" element={<PremiumRequests />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
