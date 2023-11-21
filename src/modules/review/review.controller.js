import { AppError } from "../../utils/AppError.js";
import reviewModel from "../../../database/models/review.model.js";
import errorHandler from "../../middleware/errorHandler.js";
// // ***************************create review**************************
const createReview = errorHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  let reviewExist = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (reviewExist) return next(new AppError("You Already Add A Review", 409));
  let review = new reviewModel(req.body);
  await review.save();
  res.json({ message: "success", review });
});

// // *************************get review by id************************
const getReviewById = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let review = await reviewModel.findOne({ _id: id, user: req.user._id });
  !review && next(new AppError("review Not Found!", 404));
  review && res.json({ message: "success", review });
});

// // *************************get all reviews************************
const getAllReviews = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let reviews = await reviewModel.find({ product: id });
  res.json({ message: "success", reviews });
});
// // *************************update review*************************
const updateReview = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let review = await reviewModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    { new: true }
  );
  !review && next(new AppError("review Not Found!", 404));
  review && res.json({ message: "success", review });
});

// // ******************************delete review****************************
const deleteReview = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let review = await reviewModel.findOneAndDelete(
    { _id: id, user: req.user._id },
    { new: true }
  );
  !review && next(new AppError("review Not Found!", 404));
  review && res.json({ message: "success", review });
});

export {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews,
};
