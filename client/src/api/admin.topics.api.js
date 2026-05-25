import api from "./api";

export const getTopics = async () => {
  const res = await api.get("/topics");
  return res.data;
};

export const createTopic = async (data) => {
  const res = await api.post("/topics", data);
  return res.data;
};

export const updateTopic = async (id, data) => {
  const res = await api.put(`/topics/${id}`, data);
  return res.data;
};

export const deleteTopic = async (id) => {
  const res = await api.delete(`/topics/${id}`);
  return res.data;
};
