import { getToken, removeToken } from "../utils/token";

export const useAuth = () => {
  const token = getToken();

  const logout = () => {
    removeToken();
  };

  return {
    isAuth: !!token,
    token,
    logout,
  };
};
