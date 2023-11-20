import { Router } from "express";
import {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
} from "./brand.controller.js";
import validation from "../../middleware/validation.js";
import {
  createBrandSchema,
  updateBrandSchema,
  deleteBrandSchema,
  getOneBrandSchema,
} from "./brand.validation.js";
import uploadFileOnCloud from "../../middleware/uploadFileOnCloud.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
import productRouter from "../product/product.routes.js";
const brandRouter = Router();
brandRouter.use("/:id/product", productRouter);
brandRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("admin", "seller"),
    uploadFileOnCloud().single("logo"),
    validation(createBrandSchema),
    createBrand
  )
  .get(protectRoutes, getAllBrands);
brandRouter
  .route("/:id")
  .get(protectRoutes, validation(getOneBrandSchema), getBrandById)
  .put(
    protectRoutes,
    allowTo("admin", "seller"),
    uploadFileOnCloud().single("logo"),
    validation(updateBrandSchema),
    updateBrand
  )
  .delete(
    protectRoutes,
    allowTo("admin", "seller"),
    validation(deleteBrandSchema),
    deleteBrand
  );

export default brandRouter;
