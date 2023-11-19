import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "too shorter brand name"],
      maxLength: [15, "too longer brand name"],
      required: [true, "brand name required"],
      lowerCase: true,
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    logo: Object,
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    updatedBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const brandModel = model("brand", brandSchema);
export default brandModel;
