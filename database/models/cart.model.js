import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    totalPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

const cartModel = model("cart", cartSchema);
export default cartModel;
