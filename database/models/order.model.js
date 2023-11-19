import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: "product" },
        quantity: Number,
        price: Number,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    orderTotalPrice: Number,
    shippingAddress: {
      street: String,
      city: String,
      phone: Number,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDeliverd: { type: Boolean, default: false },
    deleiverdAt: Date,
  },
  { timestamps: true }
);

const orderModel = model("order", orderSchema);
export default orderModel;
