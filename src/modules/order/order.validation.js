import Joi from "joi";

// 1- create Cart schema
const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    phone: Joi.number().required(),
  }),
});

const getOneOrderSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export { createOrderSchema, getOneOrderSchema };
