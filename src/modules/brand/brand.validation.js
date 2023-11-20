import Joi from "joi";

// 1- create brand schema
const createBrandSchema = Joi.object({
  name: Joi.string().min(2).required(),
});
// 2- update brand schema
const updateBrandSchema = Joi.object({
  name: Joi.string().min(2).required(),
  id: Joi.string().hex().length(24).required(),
});

const getOneBrandSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const deleteBrandSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createBrandSchema,
  updateBrandSchema,
  deleteBrandSchema,
  getOneBrandSchema,
};
