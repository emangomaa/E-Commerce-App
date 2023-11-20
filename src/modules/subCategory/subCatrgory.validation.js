import Joi from "joi";

// // validation schema

const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).required(),
  category: Joi.string().hex().length(24).required(),
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(2).required(),
  id: Joi.string().hex().length(24).required(),
});
const deleteSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const getOneSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const getAllSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createSubCategorySchema,
  updateSubCategorySchema,
  deleteSubCategorySchema,
  getOneSubCategorySchema,
  getAllSubCategorySchema,
};
