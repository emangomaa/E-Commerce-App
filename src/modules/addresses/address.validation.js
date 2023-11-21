import Joi from "joi";

const addAddressSchema = Joi.object({
  address: Joi.object().required(),
});

const deleteAddressSchema = Joi.object({
  address: Joi.object().required(),
});
export { addAddressSchema, deleteAddressSchema };
