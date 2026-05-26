import api from "./api";
import axios from "axios";
import { setToken } from "../utils/token";

// existing
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // Persist token using helper so `api` interceptor picks it up
  if (res.data?.token) setToken(res.data.token);
  if (res.data?.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    if (res.data.user.theme) {
      localStorage.setItem("theme", res.data.user.theme);
    }
  }

  return res.data;
};

// export const loginUser = async (data) => {
//   const res = await api.post("/auth/login", data);

//   // ✅ SAVE USER AFTER LOGIN
//   if (res.data?.user) {
//     localStorage.setItem("user", JSON.stringify(res.data.user));
//   }

//   if (res.data?.token) {
//     localStorage.setItem("token", res.data.token);
//   }

//   return res.data;
// };
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/update", data);
  if (res?.data?.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

// CHANGE PASSWORD
export const changePassword = async (data) => {
  // Accept either { currentPassword, newPassword } or { oldPassword, newPassword }
  const payload = {
    oldPassword: data.oldPassword || data.currentPassword,
    newPassword: data.newPassword,
  };

  const res = await api.post("/auth/change-password", payload);
  return res.data;
};

// CHANGE EMAIL REQUEST
export const changeEmailRequest = async (data) => {
  const res = await api.post("/auth/change-email", data);
  return res.data;
};

export const forgotPasswordRequest = async () => {
  const res = await api.post("/auth/forgot-password");
  return res.data;
};

export const verifyForgotPasswordOtp = async (data) => {
  const res = await api.post("/auth/verify-forgot-password", data);
  return res.data;
};
