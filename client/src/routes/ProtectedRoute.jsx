import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/topics" replace />;
    }
    // expired check
    if (decoded.isActive) {
      return <Navigate to="/topics" replace />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
