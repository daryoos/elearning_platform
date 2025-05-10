const sequelize = require("../config/db");
const Enrollment = require("../models/Enrollment");

const getEnrollmentsPerMonth = async (courseId) => {
    const [results] = await sequelize.query(
        `
      SELECT 
        DATE_FORMAT(enrollmentDate, '%Y-%m') AS month,
        COUNT(*) AS count
      FROM enrollment
      WHERE courseId = ?
      GROUP BY month
      ORDER BY month ASC
      `,
        { replacements: [courseId] }
    );

    return results;
};

module.exports = {
    getEnrollmentsPerMonth
};