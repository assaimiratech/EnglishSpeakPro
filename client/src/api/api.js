import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

    console.error("API ERROR:", error); // 👈 log FULL error

    return Promise.reject({
      message,
      status: error.response?.status || null,
      data: error.response?.data || null,
      original: error, // 👈 IMPORTANT for debugging
    });
  },
);
export default api;
