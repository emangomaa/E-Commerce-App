import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import connection from "./database/db.connection.js";
import categoryRouter from "./src/modules/category/category.routes.js";
import subcategoryRouter from "./src/modules/subCategory/subCategory.routes.js";
import { AppError } from "./src/utils/AppError.js";
import globalErrorHandler from "./src/utils/globalErrorHandler.js";
import userRouter from "./src/modules/user/user.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";

import brandRouter from "./src/modules/brand/brand.routes.js";
import productRouter from "./src/modules/product/product.routes.js";
import reviewRouter from "./src/modules/review/review.routes.js";
import wishListRouter from "./src/modules/wishList/wishList.routes.js";
import addressRouter from "./src/modules/addresses/address.routes.js";
import couponRouter from "./src/modules/coupon/coupon.routes.js";
import CartRouter from "./src/modules/cart/cart.routes.js";
import orderRouter from "./src/modules/order/order.routes.js";
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("uploads"));
connection();
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subCategory", subcategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/wishList", wishListRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/order", orderRouter);
app.get("*", (req, res, next) => {
  next(new AppError(`can't find this route ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
app.listen(port, () => console.log(`server up and listening on port ${port}!`));
