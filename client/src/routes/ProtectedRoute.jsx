import { Navigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Block only explicitly inactive users
    if (decoded.isActive === false || decoded.isActive === "false") {
      removeToken();
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    removeToken();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
