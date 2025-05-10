import axios from "../api/axios";

export const loginUser = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post("/auth/register", userData);
  return res.data;
};
