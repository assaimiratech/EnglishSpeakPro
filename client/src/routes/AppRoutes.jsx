import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Landing = lazy(() => import("../pages/public/Landing"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Topics = lazy(() => import("../pages/app/Topics"));
const Lessons = lazy(() => import("../pages/app/Lessons"));
const Profile = lazy(() => import("../pages/app/Profile"));
const AppLayout = lazy(() => import("../components/layout/AppLayout"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          Loading app...
        </div>
      }
    >
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />

        {/* USER APP */}
        <Route
          path="/topics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Topics />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics/:topicId/lessons"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Lessons />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
