import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "too shorter subcategory name"],
      required: [true, "subcategory name required"],
      lowerCase: true,
      trim: true,
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: [true, "product category required"],
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

const subCategoryModel = model("subCategory", subCategorySchema);

export default subCategoryModel;
