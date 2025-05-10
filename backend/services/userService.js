const User = require("../models/User");
const Language = require("../models/Language");
const bcrypt = require("bcrypt");

const loginUser = async ({ email, password }) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
};

const createUser = async ({ name, email, password, languageId, role }) => {
    const user = await getUserByEmail(email);
    if (user) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // 👇 leagă limba preferată
    if (languageId) {
        await addUserLanguage(newUser.id, languageId);
    }

    // returnează userul complet cu limbile incluse
    return await getUserById(newUser.id);
};

const getAllUsers = async () => {
    return await User.findAll();
};

const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        include: {
            model: Language,
            attributes: ["id", "name"],
            through: { attributes: [] },
        },
    });
    return user
};

const getUserByEmail = async (email) => {
    return await User.findOne({
        where: { email }, include: {
            model: Language,
            attributes: ["id", "name"],
            through: { attributes: [] },
        },
    });
};

const updateUser = async (id, data) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
    }

    return await user.update(data);
};

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    return await user.destroy();
};

const getUserLanguages = async (userId) => {
    const user = await User.findByPk(userId, {
        include: {
            model: Language,
            through: { attributes: [] }, // optional: exclude join table data
        },
    });

    if (!user) throw new Error("User not found");

    return user.Languages; // Sequelize will populate this based on association
};

const addUserLanguage = async (userId, languageId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const language = await Language.findByPk(languageId);
    if (!language) throw new Error("Language not found");

    await user.addLanguage(language); // Sequelize magic method
    return { message: "Language added to user successfully" };
};


module.exports = {
    loginUser,
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getUserLanguages,
    addUserLanguage,
};