import axios from "../api/axios";

export const enrollInCourse = async (enrollmentData, token) => {
  const res = await axios.post("/enrollments/enroll", enrollmentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getEnrollmentsByUser = async (userId, token) => {
  const res = await axios.get(`/enrollments/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getEnrollmentsByCourse = async (courseId, token) => {
  const res = await axios.get(`/enrollments/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getEnrollmentCalendar = async (courseId, token) => {
  const res = await axios.get(`/enrollments/calendar/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
