import userModel from "../../../database/models/user.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, getOne } from "../../utils/handlers/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import codeSendEmail from "../../email/codeSendEmail.js";
// ***************************create user**************************
const createUser = errorHandler(async (req, res, next) => {
  let userExist = await userModel.findOne({ email: req.body.email });
  if (userExist) return next(new AppError("User Already Exist!", 400));

  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "Ecommerce/profilePic",
      }
    );
    req.body.profilePic = { URL: secure_url, public_id };
  }

  let user = new userModel(req.body);
  let newUser = await user.save();
  res.status(201).json({ message: "success", newUser });
});
// *************************get all users**********************
const getAllUsers = errorHandler(async (req, res, next) => {
  let APIFeature = new APIFeatures(userModel.find(), req.query)
    .Pagination()
    .Sort()
    .Filter()
    .Fields()
    .Search();

  let users = await APIFeature.mongooseQuery;

  res.json({ message: "success", page: APIFeature.page, users });
});
// *************************get user by id************************
const getUserById = getOne(userModel);
// *************************update user*************************
const updateUser = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let existUser = await userModel.findById(id);
  if (!existUser) return next(new AppError("user not found"), 409);

  let oldProfilePic = existUser.profilePic.public_id;
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "Ecommerce/profilePic",
      }
    );
    req.body.profilePic = { URL: secure_url, public_id };
    await cloudinary.uploader.destroy(oldProfilePic);
  }
  let user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "success", user });
});

// ******************************delete user****************************
const deleteUser = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let existUser = await userModel.findById(id);
  if (!existUser) return next(new AppError("user not found"), 409);

  let oldProfilePic = existUser.profilePic.public_id;
  let user = await userModel.findByIdAndDelete(id);
  await cloudinary.uploader.destroy(oldProfilePic);
  res.json({ message: "success", user });
});

// ******************************change password****************************
const changePassword = errorHandler(async (req, res, next) => {
  req.body.changePasswordAt = Date.now();
  let user = await userModel.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
  });
  !user && next(new AppError("user Not Found!", 404));
  user && res.json({ message: "success", user });
});

// ******************************  logout ****************************
const logOut = errorHandler(async (req, res, next) => {
  req.body.logoutAt = Date.now();
  req.body.isActive = true;
  let user = await userModel.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
  });
  !user && next(new AppError("user Not Found!", 404));
  user && res.json({ message: "success", user });
});

// *******************************forget password  *******************////
const forgetPassword = errorHandler(async (req, res, next) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return next(new AppError("user Not Found!", 404));
  // generate random code og 6 digits
  let code = Math.floor(Math.random() * 899999 + 100000);
  let verifyCodeToken = jwt.sign({ id: user._id, code }, "ecommerce");
  codeSendEmail({
    email: user.email,
    code,
    api: `http://localhost:3001/verifyCode/${verifyCodeToken}`,
  });
  res.json({ message: "success" });
});

// ******************************reset password ***************************
const resetPassword = errorHandler(async (req, res, next) => {
  let { token } = req.headers;
  let { code, password } = req.body;
  let decoded = jwt.verify(token, "ecommerce");
  if (!decoded.code) return next(new AppError("Invalid Token", 400));

  if (decoded.code === code) {
    req.body.changePasswordAt = Date.now();
    let hashPassword = bcrypt.hashSync(password, 7);
    let user = await userModel.findByIdAndUpdate(
      decoded.id,
      { password: hashPassword },
      {
        new: true,
      }
    );
    return res.json({ message: "success", user });
  }
  next(new AppError("wrong code", 409));
});
export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  forgetPassword,
  resetPassword,
  logOut,
};
