const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Course = require("./Couse");

const Enrollment = sequelize.define("Enrollment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    enrollmentDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "enrollment",
    timestamps: false,
});

Enrollment.belongsTo(User, { foreignKey: "userId", as: "student" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

module.exports = Enrollment;