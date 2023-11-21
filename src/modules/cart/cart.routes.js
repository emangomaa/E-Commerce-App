import { Router } from "express";
import {
  applyCoupon,
  createCart,
  getCart,
  removeCartItem,
  updateCart,
} from "./cart.controller.js";
import validation from "../../middleware/validation.js";
import {
  createCartSchema,
  deleteCartSchema,
  updateCartSchema,
} from "./cart.validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
const cartRouter = Router();
cartRouter
  .route("/")
  .post(protectRoutes, validation(createCartSchema), createCart)
  .get(protectRoutes, getCart)
  .put(protectRoutes, validation(updateCartSchema), updateCart);
cartRouter
  .route("/:id")
  .delete(protectRoutes, validation(deleteCartSchema), removeCartItem);
cartRouter.put("/:applyCoupon", protectRoutes, applyCoupon);
export default cartRouter;
