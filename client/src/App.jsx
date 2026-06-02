import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const AppRoutes = lazy(() => import("./routes/AppRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          Loading application...
        </div>
      }
    >
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default App;
