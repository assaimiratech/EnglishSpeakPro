import api from "./api";

export const getLessonsByTopic = async (topicId) => {
  const res = await api.get(`/lessons/${topicId}`);
  return res.data;
};

export const getAllLessons = (page, topicId) =>
  api.get("/lessons", {
    params: { page, topicId },
  });

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await api.post("/upload/audio", formData);
  return res.data;
};
