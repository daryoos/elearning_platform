const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Course = require("../models/Couse")

const Offer = sequelize.define("Offer", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: "offer",
    timestamps: false,
});

Course.hasMany(Offer, { foreignKey: "courseId" });
Offer.belongsTo(Course, { foreignKey: "courseId" });

module.exports = Offer;