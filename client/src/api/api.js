import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: "https://englishspeakpro-e7ve.onrender.com/api",
  timeout: 10000,
});
// attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({
      message,
      status: error.response?.status || null,
      data: error.response?.data || null,
      original: error,
    });
  },
);

// RESPONSE: handle blocked/unauthorized users
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("token");

      // optional: force logout
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
