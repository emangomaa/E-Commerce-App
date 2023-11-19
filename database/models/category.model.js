import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, "too shorter category name"],
      required: [true, "category name required"],
      lowerCase: true,
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    image: {
      type: Object,
      required: [true, "category image required"],
    },
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

const categoryModel = model("category", categorySchema);

export default categoryModel;
