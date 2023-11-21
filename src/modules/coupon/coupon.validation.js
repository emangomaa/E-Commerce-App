import Joi from "joi";

// 1- create review schema
const createCouponSchema = Joi.object({
  code: Joi.string().required(),
  expire: Joi.string().required(),
  discount: Joi.number().required(),
});
// 2- update Coupon schema
const updateCouponSchema = Joi.object({
  expire: Joi.string(),
  discount: Joi.number(),
  id: Joi.string().hex().length(24).required(),
});

const getOneCouponSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const deleteCouponSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
  getOneCouponSchema,
};
