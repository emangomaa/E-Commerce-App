import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  // email: Joi.string().pattern(/^[a-zA-Z0-9.]{2,}@[a-zA-Z0-9]{2,}.com/),
  email: Joi.string().required(),
  password: Joi.string().min(5).required(),
  role: Joi.string()
    .pattern(/^(user|seller)$/)
    .required(),
  phone: Joi.number().required(),
});

const deleteUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const getOneUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const updateUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(20),
  phone: Joi.number(),
  role: Joi.string().pattern(/^(user|seller)$/),
});
const changePasswordSchema = Joi.object({
  password: Joi.string().min(5).required(),
});
const forgetPasswordSchema = Joi.object({
  email: Joi.string().required(),
});
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(5).required(),
  code: Joi.number().required(),
});
export {
  createUserSchema,
  updateUserSchema,
  getOneUserSchema,
  deleteUserSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
