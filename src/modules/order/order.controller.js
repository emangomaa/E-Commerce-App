import { AppError } from "../../utils/AppError.js";
import errorHandler from "../../middleware/errorHandler.js";
import cartModel from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";
import orderModel from "../../../database/models/order.model.js";

//  ***************************create cash order   **************************
const createCashOrder = errorHandler(async (req, res, next) => {
  // 1-need cart
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("create cart frist", 409));
  // 2- orderTotalPrice check if cart has discound or not
  let orderTotalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  // 3- create order
  let order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    orderTotalPrice,
    shippingAddress: req.body.shippingAddress,
  });
  console.log(orderTotalPrice);
  await order.save();
  // 4- increase products sold items snd decrease availabe items using bulk write
  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { availableitems: -item.quantity, soldItems: item.quantity },
        },
      },
    }));

    await productModel.bulkWrite(options);
    // 5- delete cart
    await cartModel.findOneAndDelete({ _id: cart._id });
    return res.json({ message: "success", order });
  } else {
    return next(new AppError("error in order", 404));
  }
});

const getUserOrder = errorHandler(async (req, res, next) => {
  let order = await orderModel.find({ user: req.user._id, _id: req.params.id });
  res.json({ message: "success", order });
});

const getAllUserOrders = errorHandler(async (req, res, next) => {
  let orders = await orderModel.find({ user: req.user._id });
  res.json({ message: "success", orders });
});
const getAllOrders = errorHandler(async (req, res, next) => {
  let orders = await orderModel.find();
  res.json({ message: "success", orders });
});
export { createCashOrder, getUserOrder, getAllOrders, getAllUserOrders };
