import { AppError } from "../../utils/AppError.js";
import errorHandler from "../../middleware/errorHandler.js";
import cartModel from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";
import couponModel from "../../../database/models/coupon.model.js";

// ***************************   **************************
const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((element) => {
    totalPrice += element.quantity * element.price;
  });
  cart.totalPrice = totalPrice;
};

//  ***************************create cart   **************************
// add products to cart
const createCart = errorHandler(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");
  if (!product) return next(new AppError("product not found", 404));
  req.body.price = product.price;
  let isExistCart = await cartModel.findOne({ user: req.user._id });
  if (!isExistCart) {
    let cart = new cartModel({ user: req.user._id, cartItems: [req.body] });

    calcTotalPrice(cart);

    if (cart.discount) {
      cart.totalPriceAfterDiscount =
        cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
    }
    await cart.save();
    return res.json({ message: "success", cart });
  }

  let item = isExistCart.cartItems.find(
    (ele) => ele.product == req.body.product
  );
  if (item) {
    item.quantity += 1;
  } else {
    isExistCart.cartItems.push(req.body);
  }

  calcTotalPrice(isExistCart);

  if (isExistCart.discount) {
    isExistCart.totalPriceAfterDiscount =
      isExistCart.totalPrice -
      (isExistCart.totalPrice * isExistCart.discount) / 100;
  }
  await isExistCart.save();
  res.json({ message: "success", isExistCart });
});

// *************************** get cart  **************************
const getCart = errorHandler(async (req, res, next) => {
  let cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  res.json({ message: "success", cart });
});

// *************************** remove cart item   **************************
const removeCartItem = errorHandler(async (req, res, next) => {
  let cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  calcTotalPrice(cart);
  if (cart.discount) {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }

  res.json({ message: "success", cart });
});

// ***************************update cart   **************************
const updateCart = errorHandler(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");
  if (!product) return next(new AppError("product not found", 404));
  req.body.price = product.price;

  const cart = await cartModel.findOne({ user: req.user._id });

  let item = cart.cartItems.find((ele) => ele.product == req.body.product);

  if (!item) return next(new AppError("item not exist", 409));
  if (item) {
    item.quantity = req.body.quantity;
  }

  calcTotalPrice(cart);

  if (cart.discount) {
    cart.totalPriceAfterDiscount =
      cart.totalPrice - (cart.totalPrice * cart.discount) / 100;
  }
  await cart.save();
  res.json({ message: "success", cart });
});

// ********************apply coupon ***********************

const applyCoupon = errorHandler(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expire: { $gt: Date.now() },
  });
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("create cart frist", 409));
  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();

  res.json({ message: "success", cart });
});
export { createCart, getCart, removeCartItem, updateCart, applyCoupon };
