import { AppError } from "../../utils/AppError.js";
import errorHandler from "../../middleware/errorHandler.js";
import userModel from "../../../database/models/user.model.js";
// *************************add to wish list*************************
const addToAddresses = errorHandler(async (req, res, next) => {
  let { address } = req.body;
  let result = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { addresses: address } },
    { new: true }
  );
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", result });
});

// *************************delete from wish list************************
const deleteFromAddresses = errorHandler(async (req, res, next) => {
  let { address } = req.body;
  let result = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { addresses: address } },
    { new: true }
  );
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", result });
});

// *************************delete from wish list************************
const getAddresses = errorHandler(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id });
  !result && next(new AppError("user Not Found!", 404));
  result && res.json({ message: "success", result: result.addresses });
});
export { addToAddresses, deleteFromAddresses, getAddresses };
