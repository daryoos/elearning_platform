import axios from "../api/axios";

export const getAllCourses = async () => {
  const res = await axios.get("/courses/getAll");
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await axios.get(`/courses/getById/${id}`);
  return res.data;
};

export const getCoursesByProfessor = async (id) => {
  const res = await axios.get(`/courses/byProfessor/${id}`);
  return res.data;
};

export const createCourse = async (userId, courseData, token) => {
  if (!courseData.id) delete courseData.id;
  const res = await axios.post(`/courses/create/${userId}`, courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCourse = async (id, courseData, token) => {
  const res = await axios.put(`/courses/update/${id}`, courseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCourse = async (id, token) => {
  const res = await axios.delete(`/courses/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
