const offerService = require("../services/offerService");

exports.createOffer = async (req, res, next) => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

exports.getOffersByCourse = async (req, res, next) => {
  try {
    const offers = await offerService.getOffersByCourse(req.params.courseId);
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    const result = await offerService.deleteOffer(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getActiveOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getActiveOffers();
    res.json(offers);
  } catch (error) {
    next(error);
  }
};
