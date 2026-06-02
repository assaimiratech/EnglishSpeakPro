import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import AdminRoute from "./AdminRoute";

const Users = lazy(() => import("../pages/admin/Users"));
const Lessons = lazy(() => import("../pages/admin/Lessons"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const PremiumRequests = lazy(() => import("../pages/admin/PremiumRequests"));
const Content = lazy(() => import("../pages/admin/Content"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

const AdminRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          Loading admin...
        </div>
      }
    >
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
    </Suspense>
  );
};

export default AdminRoutes;
