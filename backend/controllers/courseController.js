const courseService = require("../services/courseService");
const enrollmentService = require("../services/enrollmentService");

exports.getCoursesByProfessor = async (req, res, next) => {
  try {
      const { userId } = req.params;
      const courses = await courseService.getCoursesByProfessor(userId);
      res.json(courses);
  } catch (err) {
      next(err);
  }
};

exports.getAllCourses = async (req, res, next) => {
    try {
      const { startDate, endDate, domain } = req.query;
      const allCourses = await courseService.getAllCourses();
  
      let filteredCourses = allCourses;
  
      if (startDate && endDate) {
        filteredCourses = filteredCourses.filter((c) =>
          c.startDate >= startDate && c.endDate <= endDate
        );
      }
  
      if (domain) {
        filteredCourses = filteredCourses.filter((c) => c.domain === domain);
      }
  
      // Calculăm locurile disponibile dinamic
      const result = await Promise.all(
        filteredCourses.map(async (course) => {
          const enrolled = await enrollmentService.getEnrollmentCount(course.id);
          return {
            ...course.toJSON(),
            availableSeats: course.seats - enrolled,
          };
        })
      );
  
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

exports.getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        res.json(course);
    } catch (error) {
        next(error);
    }
};

exports.createCourse = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const courseData = req.body;
        const newCourse = await courseService.createCourse({
            ...courseData,
            userId,
        });
        res.status(200).json(newCourse);
    } catch(error) {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const updated = courseService.updateCourse(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        const deleted = await courseService.deleteCourse(req.params.id);
        res.json(deleted);
    } catch (error) {
        next(error);
    }
};