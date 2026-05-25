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
    const data = error.response?.data;
    const message = data?.message || "Something went wrong";

    console.error("API ERROR:", message);

    return Promise.reject({
      message,
      status: error.response?.status,
      data,
    });
  },
);

export default api;
