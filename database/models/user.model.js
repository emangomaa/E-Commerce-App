import { Schema, model, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../src/email/sendEmail.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "user name too shorter"],
      maxLength: [15, "user name too longer"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: [true, "email required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password required,"],
      trim: true,
      minLength: [6, "min length 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "phone number required"],
    },
    profilePic: Object,
    role: {
      type: String,
      default: "user",
      enum: ["user", "seller", "admin"],
    },
    wishList: [{ type: Types.ObjectId, ref: "product" }],
    addresses: [{ city: String, street: String }],
    changePasswordAt: Date,
    logoutAt: Date,
    isActive: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
userSchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "createdBy",
});
userSchema.pre("save", function () {
  // this.password = bcrypt.hashSync(this.password, process.env.SOULT_ROUNDS);
  this.password = bcrypt.hashSync(this.password, 7);
});
userSchema.pre("findByIdAndUpdate", function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 7);
  }
});
userSchema.pre(/^find/, function () {
  this.populate("products");
});
userSchema.post("save", function () {
  let verifyEmailToken = jwt.sign({ id: this._id }, "emailtokenkey");
  sendEmail({
    email: this.email,
    name: this.name,
    api: `http://localhost:3000/api/v1/auth/verify/${verifyEmailToken}`,
  });
});


const userModel = model("user", userSchema);

export default userModel;
