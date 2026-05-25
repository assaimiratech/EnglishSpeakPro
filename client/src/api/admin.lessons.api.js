import api from "./api";

export const getLessonsByTopic = async (topicId) => {
  const res = await api.get(`/lessons/${topicId}`);
  return res.data;
};

export const createLesson = async (data) => {
  const res = await api.post("/lessons", data);
  return res.data;
};

export const updateLesson = async (id, data) => {
  const res = await api.put(`/lessons/${id}`, data);
  return res.data;
};

export const deleteLesson = async (id) => {
  const res = await api.delete(`/lessons/${id}`);
  return res.data;
};

export const uploadAudio = async (file, token) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await api.post("/lessons/upload/audio", formData);

  return res.data;
};
