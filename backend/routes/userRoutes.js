const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.get(
    "/getAll",
    authenticateToken,
    verifyRole("admin"),
    userController.getAllUsers
);
router.get(
    "/getById/:id",
    authenticateToken,
    verifyRole("admin"),
    userController.getUserById
);
router.get(
    "/getByEmail/:email",
    authenticateToken,
    verifyRole("admin"),
    userController.getUserByEmail
);
router.put(
    "/update/:id",
    authenticateToken,
    verifyRole("user", "admin"),
    userController.updateUser
);
router.delete(
    "/delete/:id",
    authenticateToken,
    verifyRole("admin"),
    userController.deleteUser
);
router.post(
    "/create",
    authenticateToken,
    verifyRole("admin"),
    userController.createUser
);
router.get(
    "/getLanguages/:id",
    authenticateToken,
    verifyRole("user","admin"),
    userController.getUserLanguages
);
router.post(
    "/addLanguage/:id",
    authenticateToken,
    verifyRole("user", "admin"),
    userController.addUserLanguage
);

module.exports = router;