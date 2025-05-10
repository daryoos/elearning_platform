const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.post(
  "/create",
  authenticateToken,
  verifyRole("professor", "admin"),
  offerController.createOffer
);

router.get(
  "/course/:courseId",
  authenticateToken,
  offerController.getOffersByCourse
);

router.delete(
  "/:id",
  authenticateToken,
  verifyRole("professor", "admin"),
  offerController.deleteOffer
);

router.get(
  "/active",
  offerController.getActiveOffers
);

module.exports = router;
