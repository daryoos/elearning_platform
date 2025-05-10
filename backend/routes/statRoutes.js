const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.get(
    "/enrollmentsPerMonth/:courseId",
    authenticateToken,
    verifyRole("professor", "admin"),
    statController.getEnrollmentsPerMonth
);

module.exports = router;