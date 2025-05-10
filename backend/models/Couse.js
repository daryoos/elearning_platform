const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Course = sequelize.define("Course", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    domain: {
        type: DataTypes.STRING,
    },
    language: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    sessions: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    seats: {
        type: DataTypes.INTEGER,
    },
    languageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'language',
            key: 'id'
        }
    }
}, {
    tableName: "course",
    timestamps: false,
});

Course.belongsTo(User, {
    foreignKey: "userId",
    as: "professor"
});

module.exports = Course;