import { Routes, Route } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Lessons from "./pages/admin/Lessons";

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/topics/:topicId/lessons" element={<Lessons />} />
    </Routes>
  );
};

export default App;
