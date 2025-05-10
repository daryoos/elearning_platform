const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

router.get(
    "/getAll",
    languageController.getAllLanguages
);
router.get(
    "/getById/:id",
    authenticateToken,
    languageController.getLanguageById
);
router.get(
    "/getByName/:name",
    authenticateToken,
    languageController.getLanguageByName
);
router.put(
    "/update/:id",
    authenticateToken,
    verifyRole("admin"),
    languageController.updateLanguage
);
router.delete(
    "/delete/:id",
    authenticateToken,
    verifyRole("admin"),
    languageController.deleteLanguage
);
router.post(
    "/create",
    authenticateToken,
    verifyRole("admin"),
    languageController.createLanguage
);

module.exports = router;