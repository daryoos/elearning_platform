const statService = require("../services/statService");

exports.getEnrollmentsPerMonth = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const stats = await statService.getEnrollmentsPerMonth(courseId);
        res.json(stats);
    } catch (error) {
        next(error);
    }
}