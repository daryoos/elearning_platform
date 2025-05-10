const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.get(
    "/getAll",
    courseController.getAllCourses
);
router.get(
    "/byProfessor/:userId",
    authenticateToken,
    verifyRole("professor", "admin"),
    courseController.getCoursesByProfessor
  );
router.get(
    "/getById/:id",
    authenticateToken,
    courseController.getCourseById);
router.post(
    "/create/:userId",
    authenticateToken,
    verifyRole("professor", "admin"),
    courseController.createCourse);
router.put("/update/:id",
    authenticateToken,
    verifyRole("professor", "admin"),
    courseController.updateCourse);
router.delete("/delete/:id",
    authenticateToken,
    verifyRole("professor", "admin"),
    courseController.deleteCourse);

module.exports = router;