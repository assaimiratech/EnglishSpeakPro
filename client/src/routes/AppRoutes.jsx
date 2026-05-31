import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/public/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Topics from "../pages/app/Topics";
import Lessons from "../pages/app/Lessons";
import Settings from "../pages/app/Settings";

import AppLayout from "../components/layout/AppLayout";
import Profile from "../pages/public/Profile";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
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
        path="/lessons/:topicId"
        element={
          <AppLayout>
            <Lessons />
          </AppLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AppLayout>
            <Settings />
          </AppLayout>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
