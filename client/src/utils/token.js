const TOKEN_KEY = "es_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
