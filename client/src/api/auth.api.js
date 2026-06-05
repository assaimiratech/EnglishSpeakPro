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

  if (res.data?.token) setToken(res.data.token);

  if (res.data?.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));

    if (res.data.user.theme) {
      localStorage.setItem("theme", res.data.user.theme);
    }
  }

  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/update", data);

  const me = await api.get("/auth/me");

  localStorage.setItem("user", JSON.stringify(me.data.user));

  return me.data;
};

export const changePassword = async (data) => {
  const payload = {
    oldPassword: data.oldPassword || data.currentPassword,
    newPassword: data.newPassword,
  };

  const res = await api.post("/auth/change-password", payload);
  return res.data;
};
