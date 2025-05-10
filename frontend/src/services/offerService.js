import axios from "../api/axios";

export const createOffer = async (offerData, token) => {
  const res = await axios.post("/offers/create", offerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getOffersByCourse = async (courseId) => {
  const res = await axios.get(`/offers/course/${courseId}`);
  return res.data;
};

export const getActiveOffers = async () => {
  const res = await axios.get("/offers/active");
  return res.data;
};

export const deleteOffer = async (id, token) => {
  const res = await axios.delete(`/offers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
