import express from "express";
import { signIn, signUp, verifyEmail } from "./auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.get("/verify/:token", verifyEmail);
authRouter.post("/signIn", signIn);
export default authRouter;
