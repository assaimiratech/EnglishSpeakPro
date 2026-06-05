import { useState, useEffect } from "react";
import { getToken, removeToken } from "../utils/token";
import { getMe } from "../api/auth.api";

export const useAuth = () => {
  const token = getToken();
  const [user, setUser] = useState(null);

  const logout = () => {
    removeToken();
    setUser(null);
    localStorage.removeItem("user");
  };

  const fetchUser = async () => {
    if (!token) return;

    const data = await getMe();
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    isAuth: !!token,
    token,
    user,
    setUser,
    fetchUser,
    logout,
  };
};
