import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, "too shorter product name"],
      maxLength: [30, "too longer product name"],
      required: [true, "product name required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [5, "too Shorter product description"],
      maxLength: [300, "too longer product description"],
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 1,
      required: [true, "product price required"],
    },
    discount: {
      type: Number,
      min: 1, // this up to bussiness requirements
    },
    availableitems: {
      type: Number,
      min: 1,
      default: 1,
    },
    soldItems: {
      type: Number,
      min: 0,
      default: 0,
    },
    coverImage: Object,
    images: [Object],
    imgsFolder: String,
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: [true, "product category required"],
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "subCategory",
      required: [true, "product subCategory required"],
    },
    brand: {
      type: Types.ObjectId,
      ref: "brand",
      required: [true, "product brand required"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "product owner required"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "product owner required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre(/^find/, function () {
  this.populate("reviews");
});
const productModel = model("product", productSchema);

export default productModel;
