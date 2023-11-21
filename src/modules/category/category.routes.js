import { Router } from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllcategories,
  getCategoryById,
} from "./category.controller.js";
import subcategoryRouter from "../subCategory/subCategory.routes.js";
import validation from "../../middleware/validation.js";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getOneCategorySchema,
} from "./category.validation.js";
import uploadFileOnCloud from "../../middleware/uploadFileOnCloud.js";
import productRouter from "../product/product.routes.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
const categoryRouter = Router();

// redirect routes to other Routers
categoryRouter.use("/:id/subCategory", subcategoryRouter);
categoryRouter.use("/:id/product", productRouter);

categoryRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("seller"),
    uploadFileOnCloud().single("image"),
    validation(createCategorySchema),
    createCategory
  )
  .get(getAllcategories);

categoryRouter
  .route("/:id")
  .get(validation(getOneCategorySchema), getCategoryById)
  .put(
    protectRoutes,
    allowTo("seller"),
    uploadFileOnCloud().single("image"),
    validation(updateCategorySchema),
    updateCategory
  )
  .delete(
    protectRoutes,
    allowTo("seller"),
    validation(deleteCategorySchema),
    deleteCategory
  );

export default categoryRouter;
