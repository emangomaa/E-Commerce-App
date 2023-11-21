import { Router } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewById,
  getAllReviews,
} from "./review.controller.js";
import validation from "../../middleware/validation.js";
import {
  createReviewSchema,
  updateReviewSchema,
  deleteReviewSchema,
  getOneReviewSchema,
} from "./review.validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
const reviewRouter = Router();
reviewRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("user"),
    validation(createReviewSchema),
    createReview
  );
reviewRouter
  .route("/:id")
  .get(protectRoutes, validation(getOneReviewSchema), getReviewById)
  .put(
    protectRoutes,
    allowTo("user"),
    validation(updateReviewSchema),
    updateReview
  )
  .delete(
    protectRoutes,
    allowTo("user", "seller"),
    validation(deleteReviewSchema),
    deleteReview
  );

reviewRouter.get("/allReviews/:id", protectRoutes, getAllReviews);
export default reviewRouter;
