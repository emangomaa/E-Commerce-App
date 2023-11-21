import { AppError } from "../../utils/AppError.js";
import errorHandler from "../../middleware/errorHandler.js";
import userModel from "../../../database/models/user.model.js";
// *************************add to wish list*************************
const addToWishList = errorHandler(async (req, res, next) => {
  let { product } = req.body;
  let result = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { wishList: product } },
    { new: true }
  );
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", wishList: result.wishList });
});

// *************************delete from wish list************************
const deleteFromWishList = errorHandler(async (req, res, next) => {
  let { product } = req.body;
  let result = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { wishList: product } },
    { new: true }
  );
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", wishList: result.wishList });
});

// *************************delete from wish list************************
const getWishList = errorHandler(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id });
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", wishList: result.wishList });
});
export { addToWishList, deleteFromWishList, getWishList };
