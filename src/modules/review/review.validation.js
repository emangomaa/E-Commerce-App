import Joi from "joi";

// 1- create review schema
const createReviewSchema = Joi.object({
  comment: Joi.string().min(3).required(),
  rating: Joi.number().min(1).max(5).required(),
  product: Joi.string().hex().length(24).required(),
});
// 2- update Review schema
const updateReviewSchema = Joi.object({
  comment: Joi.string().min(3),
  rating: Joi.number().min(1).max(5),
  product: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24).required(),
});

const getOneReviewSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const deleteReviewSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
  getOneReviewSchema,
};
