import { AppError } from "../../utils/AppError.js";
import errorHandler from "../../middleware/errorHandler.js";
import couponModel from "../../../database/models/coupon.model.js";
import QRCode from "qrcode";
// // ***************************create coupon**************************
const createCoupon = errorHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  let url = await QRCode.toDataURL(req.body.code);
  req.body.url = url;
  let coupon = new couponModel(req.body);
  let newCoupon = await coupon.save();
  res.json({ message: "success", newCoupon });
});

// // ***************************get all coupon**************************
const getAllCoupon = errorHandler(async (req, res, next) => {
  let coupons = await couponModel.find();
  res.json({ message: "success", coupons });
});
// // *************************get coupon by id************************
const getCouponById = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let coupon = await couponModel.findById(id);
  !coupon && next(new AppError("coupon Not Found!", 404));
  coupon && res.json({ message: "success", coupon });
});
// // *************************update coupon*************************
const updateCoupon = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let coupon = await couponModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  !coupon && next(new AppError("coupon Not Found!", 404));
  coupon && res.json({ message: "success", coupon });
});

// // ******************************delete coupon****************************
const deleteCoupon = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let coupon = await couponModel.findByIdAndDelete(id);
  !coupon && next(new AppError("coupon Not Found!", 404));
  coupon && res.json({ message: "success", coupon });
});

export {
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getAllCoupon,
};
