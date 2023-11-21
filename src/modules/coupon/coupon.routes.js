import { Router } from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupon,
} from "./coupon.controller.js";
import validation from "../../middleware/validation.js";
import {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
  getOneCouponSchema,
} from "./coupon.validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
const couponRouter = Router();
couponRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("seller"),
    validation(createCouponSchema),
    createCoupon
  )
  .get(protectRoutes, allowTo("seller"), getAllCoupon);
couponRouter
  .route("/:id")
  .get(
    protectRoutes,
    allowTo("seller"),
    validation(getOneCouponSchema),
    getCouponById
  )
  .put(
    protectRoutes,
    allowTo("seller"),
    validation(updateCouponSchema),
    updateCoupon
  )
  .delete(
    protectRoutes,
    allowTo("seller"),
    validation(deleteCouponSchema),
    deleteCoupon
  );

export default couponRouter;
