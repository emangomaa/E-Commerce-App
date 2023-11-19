import { Schema, model, Types } from "mongoose";
const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "review comment required"],
      minLength: [3, "review comment too shorter"],
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "rating required"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate("user", "name");
});
const reviewModel = model("review", reviewSchema);
export default reviewModel;
