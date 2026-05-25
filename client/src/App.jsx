import { Routes, Route } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/naja/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default App;
