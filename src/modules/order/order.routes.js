import { Router } from "express";
import validation from "../../middleware/validation.js";

import { allowTo, protectRoutes } from "../auth/auth.controller.js";
import {
  createCashOrder,
  getAllOrders,
  getAllUserOrders,
  getUserOrder,
} from "./order.controller.js";
import { createOrderSchema, getOneOrderSchema } from "./order.validation.js";
const orderRouter = Router();
orderRouter
  .route("/")
  .post(protectRoutes, validation(createOrderSchema), createCashOrder)
  .get(protectRoutes, allowTo("seller"), getAllOrders);
orderRouter.route("/userOrders").get(protectRoutes, getAllUserOrders);
orderRouter
  .route("/:id")
  .get(protectRoutes, validation(getOneOrderSchema), getUserOrder);
export default orderRouter;
