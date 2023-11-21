import Joi from "joi";

const addWishListSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
});

const deleteWishListSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
});
export { addWishListSchema, deleteWishListSchema };
