import { Router } from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  changePassword,
  logOut,
  forgetPassword,
  resetPassword,
} from "./user.controller.js";
import uploadFileOnCloud from "../../middleware/uploadFileOnCloud.js";
import validation from "../../middleware/validation.js";
import { allowTo, protectRoutes } from "../auth/auth.controller.js";
import {
  changePasswordSchema,
  createUserSchema,
  deleteUserSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
} from "./user.validation.js";
const userRouter = Router();
userRouter
  .route("/")
  .post(
    protectRoutes,
    allowTo("admin"),
    uploadFileOnCloud().single("profilePic"),
    validation(createUserSchema),
    createUser
  )
  .get(protectRoutes, allowTo("admin"), getAllUsers);
userRouter
  .route("/:id")
  .get(protectRoutes, getUserById)
  .put(
    protectRoutes,
    allowTo("admin"),
    uploadFileOnCloud().single("profilePic"),
    validation(updateUserSchema),
    updateUser
  )
  .delete(
    protectRoutes,
    allowTo("admin"),
    validation(deleteUserSchema),
    deleteUser
  );
userRouter.patch(
  "/changePassword",
  protectRoutes,
  validation(changePasswordSchema),
  changePassword
);

userRouter.patch(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  forgetPassword
);
userRouter.patch(
  "/resetPassword",
  validation(resetPasswordSchema),
  resetPassword
);
userRouter.patch("/logOut", protectRoutes, logOut);
export default userRouter;
