import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
} from "./subCategory.controller.js";
import validation from "../../middleware/validation.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
  deleteSubCategorySchema,
  getOneSubCategorySchema,
} from "./subCatrgory.validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
import productRouter from "../product/product.routes.js";
const subcategoryRouter = Router({ mergeParams: true });
subcategoryRouter.use("/:id/product", productRouter);
subcategoryRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("admin", "seller"),
    validation(createSubCategorySchema),
    createSubCategory
  )
  .get(protectRoutes, getAllSubCategories);

subcategoryRouter
  .route("/:id")
  .get(protectRoutes, validation(getOneSubCategorySchema), getSubCategoryById)
  .put(
    protectRoutes,
    allowTo("admin", "seller"),
    validation(updateSubCategorySchema),
    updateSubCategory
  )
  .delete(
    protectRoutes,
    allowTo("admin", "seller"),
    validation(deleteSubCategorySchema),
    deleteSubCategory
  );
export default subcategoryRouter;
