import { Router } from "express";
import {
  addToWishList,
  deleteFromWishList,
  getWishList,
} from "./wishList.controller.js";
import validation from "../../middleware/validation.js";
import {
  addWishListSchema,
  deleteWishListSchema,
} from "./wishList.validation.js";
import { protectRoutes } from "../auth/auth.controller.js";
const wishListRouter = Router();
wishListRouter
  .route("/")
  .patch(protectRoutes, validation(addWishListSchema), addToWishList)
  .get(protectRoutes, getWishList)
  .delete(protectRoutes, validation(deleteWishListSchema), deleteFromWishList);

export default wishListRouter;
