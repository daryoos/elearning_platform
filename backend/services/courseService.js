const Course = require("../models/Couse");
const Language = require("../models/Language"); // adjust path if needed
const Offer = require("../models/Offer");
const { Op } = require("sequelize");

const getCoursesByProfessor = async (professorId) => {
    try {
        const courses = await Course.findAll({
          where: { userId: professorId },
          include: [
            {
              model: Language,
              attributes: ["id", "name"],
            },
            {
              model: Offer,
              where: {
                startDate: { [Op.lte]: new Date() },
                endDate: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
        });
      
        return courses;
      } catch (error) {
        console.error("🔥 Error in getCoursesByProfessor:", error);
        throw error;
      }
  };

const getAllCourses = async () => {
    try {
        const courses = await Course.findAll({
          include: [
            {
              model: Language,
              attributes: ["id", "name"],
            },
            {
              model: Offer,
              where: {
                startDate: { [Op.lte]: new Date() },
                endDate: { [Op.gte]: new Date() },
              },
              required: false,
            },
          ],
        });
      
        return courses;
      } catch (error) {
        console.error("🔥 Error in getAllCourses:", error);
        throw error;
      }
};

const getCourseById = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
    }
    return course;
};

const createCourse = async (data) => {
    console.log("Creating course with:", data);
    return await Course.create(data);
};

const updateCourse = async (id, data) => {
    const course = await getCourseById(id);
    if (!course) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
    }

    return await course.update(data);
};

const deleteCourse = async (id) => {
    const course = await getCourseById(id);
    if (!course) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
    }

    await course.destroy();
    return { message: "Course deleted" };
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByProfessor,
};