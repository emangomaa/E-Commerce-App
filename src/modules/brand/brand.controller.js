import slugify from "slugify";
import brandModel from "../../../database/models/brand.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, getOne } from "../../utils/handlers/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";
// ***************************create category**************************
const createBrand = errorHandler(async (req, res, next) => {
  let { name } = req.body;
  let brandExist = await brandModel.findOne({ name: name.toLowerCase() });
  brandExist && next(new AppError("Brand Already Exist!", 400));
  if (!req.file) {
    next(new AppError("invalid image", 400));
  }
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "Ecommerce/brands",
      }
    );
    req.body.logo = { URL: secure_url, public_id };
  }
  if (!brandExist) {
    let brand = new brandModel({
      name: name.toLowerCase(),
      slug: slugify(name.toLowerCase()),
      logo: req.body.logo,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    let newBrand = await brand.save();
    res.json({ message: "success", newBrand });
  }
});
// *************************get all brands**********************
const getAllBrands = errorHandler(async (req, res, next) => {
  let APIFeature = new APIFeatures(brandModel.find(), req.query)
    .Pagination()
    .Sort()
    .Filter()
    .Fields()
    .Search();

  let brands = await APIFeature.mongooseQuery;

  res.json({ message: "success", page: APIFeature.page, brands });
});
// *************************get brand by id************************
const getBrandById = getOne(brandModel);
// *************************update brand*************************
const updateBrand = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;
  let brand = await brandModel.findById(id);

  let oldImgId = brand.logo.public_id;
  if (!brand) return next(new AppError("Brand Not Exist!", 404));
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "Ecommerce/brands",
      }
    );
    // delete old image
    cloudinary.uploader.destroy(oldImgId);
    req.body.logo = { URL: secure_url, public_id };
  }

  if (name) {
    req.body.slug = slugify(name);
  }
  req.body.updatedBy = req.user._id;
  let newBrand = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ message: "success", newBrand });
});

// ******************************delete brand****************************
const deleteBrand = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let brand = await brandModel.findById(id);
  if (!brand) return next(new AppError("brand not found", 404));
  var oldImgId = brand.logo.public_id;
  let deletedBrand = await brandModel.findByIdAndDelete(id);

  await cloudinary.uploader.destroy(oldImgId);
  res.json({ message: "success", deletedBrand });
});

export { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand };
