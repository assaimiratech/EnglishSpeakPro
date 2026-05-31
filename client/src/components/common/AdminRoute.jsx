import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../utils/token";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/topics" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
