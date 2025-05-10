const Language = require("../models/Language");

const createLanguage = async (data) => {
    return await Language.create(data);
};

const getAllLanguages = async () => {
    return await Language.findAll();
};

const getLanguageById = async (id) => {
    return await Language.findByPk(id);
};

const getLanguageByName = async (name) => {
    return await Language.findOne({ where: { name } });
};

const updateLanguage = async (id, data) => {
    const language = await Language.findByPk(id);
    if (!language) throw new Error("Language not found");

    return await language.update(data);
};

const deleteLanguage = async (id) => {
    const language = await Language.findByPk(id);
    if (!language) throw new Error("Language not found");

    return await language.destroy();
};

module.exports = {
    createLanguage,
    getAllLanguages,
    getLanguageById,
    getLanguageByName,
    updateLanguage,
    deleteLanguage,
};