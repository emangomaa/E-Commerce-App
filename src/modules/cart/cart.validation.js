import Joi from "joi";

// 1- create Cart schema
const createCartSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  quantity: Joi.number(),
});
// 2- update Cart schema
const updateCartSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  quantity: Joi.number(),
});

const getOneCartSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const deleteCartSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createCartSchema,
  updateCartSchema,
  deleteCartSchema,
  getOneCartSchema,
};
