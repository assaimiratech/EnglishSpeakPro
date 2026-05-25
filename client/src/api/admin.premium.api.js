import api from "./api";

export const getAllPremiumRequests = async () => {
  const res = await api.get("/premium");
  return res.data;
};

export const updatePremiumRequestStatus = async (id, status) => {
  const res = await api.put(`/premium/${id}`, { status });
  return res.data;
};

export const createPremiumRequest = async (data) => {
  const res = await api.post("/premium", data);
  return res.data;
};

export default {
  getAllPremiumRequests,
  updatePremiumRequestStatus,
  createPremiumRequest,
};
