const enrollmentService = require("../services/enrollmentService");

exports.getEnrollmentsCalendar = async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const data = await enrollmentService.getEnrollmentsByCourseGroupedByDate(courseId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

exports.enrollStudent = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;
        const enrollment = await enrollmentService.enrollStudent({ userId, courseId });
        res.status(201).json(enrollment);
    } catch (error) {
        next(error);
    }
};

exports.getStudentEnrollments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const enrollments = await enrollmentService.getEnrollmentsByStudent(userId);
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};