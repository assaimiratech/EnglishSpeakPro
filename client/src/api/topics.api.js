import api from "./api";

export const getTopics = async () => {
  const res = await api.get("/topics");
  return res.data;
};
