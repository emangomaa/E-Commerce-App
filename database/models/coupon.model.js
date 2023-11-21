import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "coupon code required"],
      trim: true,
    },
    discount: {
      type: Number,
      min: 0,
      required: [true, "discount required"],
    },
    expire: {
      type: String,
      required: [true, "expire date required"],
    },
    url: String,
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const couponModel = model("coupon", couponSchema);
export default couponModel;
