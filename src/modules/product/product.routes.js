import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
} from "./product.controller.js";
import validation from "../../middleware/validation.js";
import uploadFileOnCloud from "../../middleware/uploadFileOnCloud.js";
import {
  createProductSchema,
  deleteProductSchema,
  getOneProductSchema,
  updateProductSchema,
  getAllSchema,
} from "./product.validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
const productRouter = express.Router({ mergeParams: true });

productRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("seller"),
    uploadFileOnCloud().fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    validation(createProductSchema),
    createProduct
  )
  .get(validation(getAllSchema), getAllProducts);
productRouter
  .route("/:id")
  .get(validation(getOneProductSchema), getProductById)
  .put(
    protectRoutes,
    allowTo("seller"),
    uploadFileOnCloud().fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    validation(updateProductSchema),
    updateProduct
  )
  .delete(
    protectRoutes,
    allowTo("seller"),
    validation(deleteProductSchema),
    deleteProduct
  );
export default productRouter;
