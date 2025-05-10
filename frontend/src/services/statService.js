import axios from "../api/axios";

export const getStatsByCourse = async (courseId, token) => {
  const res = await axios.get(`/stats/enrollmentsPerMonth/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
