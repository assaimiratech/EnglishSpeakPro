import api from "./api";

/* ADMIN - GET ALL LESSONS (DRAFT + PUBLISHED) */
export const getLessonsAdmin = async (topicId, search = "") => {
  const res = await api.get("/lessons/admin", {
    params: {
      topicId,
      search,
    },
  });

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
