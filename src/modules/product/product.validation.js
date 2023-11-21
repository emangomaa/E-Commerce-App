import Joi from "joi";
const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(15).required(),
  description: Joi.string().max(300),
  price: Joi.number().required(),
  discount: Joi.number(),
  availableitems: Joi.number(),
  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24),
});

const updateProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(15),
  description: Joi.string().max(300),
  price: Joi.number(),
  discount: Joi.number(),
  availableitems: Joi.number(),
  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24),
});

const deleteProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const getOneProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const getAllSchema = Joi.object({
  id: Joi.string().hex().length(24),
});
export {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getOneProductSchema,
  getAllSchema,
};
