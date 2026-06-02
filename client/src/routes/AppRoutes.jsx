import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Topics from "../pages/app/Topics";
import Lessons from "../pages/app/Lessons";
import Profile from "../pages/app/Profile";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="profile"
        element={
          <AppLayout>
            <Profile />
          </AppLayout>
        }
      />

      {/* USER APP */}
      <Route
        path="topics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Topics />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="topics/:topicId/lessons"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Lessons />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      {/* fallback */}
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
};

export default AppRoutes;
