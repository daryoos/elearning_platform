const userService = require("../services/userService");

exports.createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.getUserByEmail = async (req, res, next) => {
    try {
        const user = await userService.getUserByEmail(req.params.email);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.getUserLanguages = async (req, res, next) => {
    try {
        const languages = await userService.getUserLanguages(req.params.id);
        res.json(languages);
    } catch (error) {
        next(error);
    }
};

exports.addUserLanguage = async (req, res, next) => {
    try {
        const { languageId } = req.body;
        const { id: userId } = req.params;

        const result = await userService.addUserLanguage(userId, languageId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};