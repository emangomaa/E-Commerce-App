import { Router } from "express";
import {
  addToAddresses,
  deleteFromAddresses,
  getAddresses,
} from "./address.controller.js";
import validation from "../../middleware/validation.js";
import { addAddressSchema, deleteAddressSchema } from "./address.validation.js";
import { protectRoutes } from "../auth/auth.controller.js";
const addressRouter = Router();
addressRouter
  .route("/")
  .patch(protectRoutes, validation(addAddressSchema), addToAddresses)
  .get(protectRoutes, getAddresses)
  .delete(protectRoutes, validation(deleteAddressSchema), deleteFromAddresses);

export default addressRouter;
