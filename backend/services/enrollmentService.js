const Enrollment = require("../models/Enrollment");
const Course = require("../models/Couse");
const User = require("../models/User");
const { Op } = require("sequelize");

const getEnrollmentsByCourseGroupedByDate = async (courseId) => {
  const enrollments = await Enrollment.findAll({
    where: { courseId },
    include: [{ model: User, as: "student", attributes: ["id", "name"] }],
  });

  const grouped = {};

  enrollments.forEach((enrollment) => {
    const date = enrollment.enrollmentDate;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push({
      id: enrollment.student.id,
      name: enrollment.student.name,
    });
  });

  return Object.entries(grouped).map(([date, students]) => ({
    date,
    students,
  }));
};

const enrollStudent = async ({ userId, courseId }) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    const existing = await Enrollment.findOne({ where: { userId, courseId } });
    if (existing) {
        const error = new Error("Stundent already enrolled");
        error.statusCode = 400;
        throw error;
    }

    const currentEnrolled = await Enrollment.count({ where: { courseId } });
    if (currentEnrolled >= course.seats) {
        const error = new Error("No seats available");
        error.statusCode = 400;
        throw error;
    }

    return await Enrollment.create({ userId, courseId });
};

const getEnrollmentsByStudent = async (userId) => {
    return await Enrollment.findAll({ where: { userId } });
};

const getEnrollmentCount = async (courseId) => {
    return await Enrollment.count({ where: { courseId } });
  };

module.exports = {
    enrollStudent,
    getEnrollmentsByStudent,
    getEnrollmentCount,
    getEnrollmentsByCourseGroupedByDate,
};