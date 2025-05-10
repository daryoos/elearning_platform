const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Course = require("./Couse");

const Language = sequelize.define("Language", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: "language",
    timestamps: false,
});

Language.belongsToMany(User, {
    through: "UserLanguages",
    foreignKey: "languageId",
    otherKey: "userId"
});
User.belongsToMany(Language, {
    through: "UserLanguages",
    foreignKey: "userId",
    otherKey: "languageId"
});

Language.hasMany(Course, { foreignKey: "languageId" });
Course.belongsTo(Language, { foreignKey: "languageId" });

module.exports = Language;
