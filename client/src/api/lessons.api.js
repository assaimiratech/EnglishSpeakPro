import api from "./api";

export const getLessonsByTopic = async (topicId) => {
  const res = await api.get(`/lessons/topic/${topicId}`);
  return res.data;
};

export const getAllLessons = (page = 1, topicFilter = "") => {
  return api.get("/lessons", {
    params: {
      page,
      topic: typeof topicFilter === "string" ? topicFilter : "",
    },
  });
};

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await api.post("/uploads/", formData);
  return res.data;
};
