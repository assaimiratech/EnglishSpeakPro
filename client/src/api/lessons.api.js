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

export const uploadAudio = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await api.post("/lessons/upload/audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return res.data;
};
