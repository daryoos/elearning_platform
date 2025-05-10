import axios from "../api/axios";

export const getAllLanguages = async () => {
  const res = await axios.get("/languages/getAll");
  return res.data;
};

export const getLanguageById = async (id) => {
  const res = await axios.get(`/languages/getById/${id}`);
  return res.data;
};

export const getLanguageByName = async (name) => {
  const res = await axios.get(`/languages/getByName/${name}`);
  return res.data;
};

export const createLanguage = async (languageData) => {
  if (!languageData.id) delete languageData.id;
  const res = await axios.post(`/languages/create`, languageData);
  return res.data;
};
