import { Navigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if account is inactive
    if (decoded.isActive === false || decoded.isActive === "false") {
      removeToken();
      return <Navigate to="/login" replace />;
    }

    // Check if user is admin
    if (decoded.role !== "admin") {
      return <Navigate to="/topics" replace />;
    }

    return children;
  } catch {
    removeToken();
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
