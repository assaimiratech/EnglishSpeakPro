import api from "./api";

/* ADMIN - GET ALL LESSONS (DRAFT + PUBLISHED) */
export const getLessonsAdmin = async (params) => {
  const res = await api.get("/lessons/admin", { params });
  return res.data;
};

/* CREATE */
export const createLesson = async (data) => {
  const res = await api.post("/lessons", data);
  return res.data;
};

/* UPDATE */
export const updateLesson = async (id, data) => {
  const res = await api.put(`/lessons/${id}`, data);
  return res.data;
};

/* DELETE */
export const deleteLesson = async (id) => {
  const res = await api.delete(`/lessons/${id}`);
  return res.data;
};

/* AUDIO UPLOAD */
export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await api.post("/lessons/upload/audio", formData);
  return res.data;
};
