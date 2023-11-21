import userModel from "../../../database/models/user.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// *********************  sign up **********************************
const signUp = errorHandler(async (req, res, next) => {
  let userExist = await userModel.findOne({ email: req.body.email });
  userExist && next(new AppError("email Already Exist", 401));

  let user = new userModel(req.body);
  await user.save();

  res.status(201).json({ message: "success", user });
});

//***************************sign in********************************** */
const signIn = errorHandler(async (req, res, next) => {
  let userExist = await userModel.findOne({ email: req.body.email });
  if (!userExist) return next(new AppError("user not exist", 401));

  if (!userExist.verified) return next(new AppError("verify email first", 401));

  let matched = await bcrypt.compare(req.body.password, userExist.password);
  if (matched) {
    console.log(userExist.changePasswordAt);
    let token = jwt.sign(
      { email: userExist.email, userId: userExist._id, role: userExist.role },
      "ecommerce"
    );
    await userModel.findByIdAndUpdate(userExist._id, { isActive: true });
    return res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password", 409));
});

// *************************verify email *********************************
const verifyEmail = errorHandler(async (req, res, next) => {
  let { token } = req.params;
  jwt.verify(token, "emailtokenkey", async (err, decoded) => {
    if (err) next(new AppError("Invalid Token", 400));
    let user = await userModel.findByIdAndUpdate(
      decoded.id,
      { verified: true },
      { new: true }
    );
    res.send(`<div style="width:400px;margin:100px auto;text-align:center">
      <h3>Email Verivied Successfully</h3>
      <a style="color:#3399A3;border:1px solid #3399A3;border-radius:25px;font-weight:bold;padding:8px;width:200px" href="http://localhost:3001/login">Login</a>
    </div>`);

    // res.json({ message: "success" });
  });
});
// 1- check token exist or not?
// 2- verify token
// 3- check if user exist or not?
// 4- check if this token is the last one or not?
// token should change after change password and logout
const protectRoutes = errorHandler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("provide token", 401));

  let decoded = jwt.verify(token, "ecommerce");
  if (!decoded.userId) return next(new AppError("invalid token", 401));

  let userExist = await userModel.findById(decoded.userId);
  if (!userExist) return next(new AppError("Not Authenticated", 404));
  // console.log(userExist);
  if (userExist.changePasswordAt) {
    let changePasswordTime = parseInt(
      userExist.changePasswordAt.getTime() / 1000
    );
    if (changePasswordTime > decoded.iat) {
      return next(new AppError("invalid token", 401));
    }
  }
  if (userExist.logoutAt) {
    let changePasswordTime = parseInt(userExist.logoutAt.getTime() / 1000);
    if (changePasswordTime > decoded.iat) {
      return next(new AppError("invalid token", 401));
    }
  }

  req.user = userExist;
  next();
});

const allowTo = (...roles) => {
  return errorHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("not authorized", 403));
    next();
  });
};
export { signIn, signUp, protectRoutes, allowTo, verifyEmail };
