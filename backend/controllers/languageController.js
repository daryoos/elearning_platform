const languageService = require("../services/languageService");

exports.createLanguage = async (req, res, next) => {
    try {
        const language = await languageService.createLanguage(req.body);
        res.json(language);
    } catch (error) {
        next(error);
    }
}

exports.getAllLanguages = async (req, res, next) => {
    try {
        const languages = await languageService.getAllLanguages();
        res.json(languages);
    } catch (error) {
        next(error);
    }
};

exports.getLanguageById = async (req, res, next) => {
    try {
        const language = await languageService.getLanguageById(req.params.id);
        if (!language) return res.status(404).json({ message: "Language not found" });

        res.json(language);
    } catch (error) {
        next(error);
    }
};

exports.getLanguageByName = async (req, res, next) => {
    try {
        const language = await languageService.getLanguageByName(req.params.email);
        if (!language) return res.status(404).json({ message: "Language not found" });

        res.json(language);
    } catch (error) {
        next(error);
    }
};

exports.deleteLanguage = async (req, res, next) => {
    try {
        await languageService.deleteLanguage(req.params.id);
        res.json({ message: "Language deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.updateLanguage = async (req, res, next) => {
    try {
        const updatedLanguage = await languageService.updateLanguage(req.params.id, req.body);
        res.json(updatedLanguage);
    } catch (error) {
        next(error);
    }
};