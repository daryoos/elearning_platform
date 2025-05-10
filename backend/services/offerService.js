const Offer = require("../models/Offer");

const createOffer = async ({ courseId, discount, startDate, endDate }) => {
  return await Offer.create({ courseId, discount, startDate, endDate });
};

const getOffersByCourse = async (courseId) => {
  return await Offer.findAll({ where: { courseId } });
};

const deleteOffer = async (id) => {
  const offer = await Offer.findByPk(id);
  if (!offer) throw new Error("Offer not found");
  await offer.destroy();
  return { message: "Offer deleted" };
};

const getActiveOffers = async () => {
  const today = new Date().toISOString().split("T")[0];
  return await Offer.findAll({
    where: {
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today },
    },
  });
};

module.exports = {
  createOffer,
  getOffersByCourse,
  deleteOffer,
  getActiveOffers,
};
