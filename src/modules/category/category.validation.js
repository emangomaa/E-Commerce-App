import Joi from "joi";

// validation schema

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2),
  id: Joi.string().hex().length(24).required(),
});
const deleteCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const getOneCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getOneCategorySchema,
};
