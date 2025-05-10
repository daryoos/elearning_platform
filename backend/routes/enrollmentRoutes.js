const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.post(
    "/enroll",
    authenticateToken,
    verifyRole("student"),
    enrollmentController.enrollStudent
);
router.get(
    "/student/:userId",
    authenticateToken,
    enrollmentController.getStudentEnrollments
);
router.get(
    "/calendar/:courseId",
    authenticateToken,
    verifyRole("professor", "admin"),
    enrollmentController.getEnrollmentsCalendar
  );

module.exports = router;