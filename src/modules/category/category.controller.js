import slugify from "slugify";
import categoryModel from "../../../database/models/category.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, getOne } from "../../utils/handlers/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";
// ***************************create category**************************
const createCategory = errorHandler(async (req, res, next) => {
  let { name } = req.body;
  let categoryExist = await categoryModel.findOne({ name: name.toLowerCase() });
  if (categoryExist) return next(new AppError("Category Already Exist!", 400));
  console.log(req.file);
  if (!req.file) {
    return next(new AppError("file required!", 400));
  }
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "Ecommerce/category",
    }
  );
  req.body.image = { URL: secure_url, public_id };
  req.body.slug = slugify(name.toLowerCase());
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  let category = new categoryModel(req.body);
  let newCategory = await category.save();
  res.status(201).json({ message: "success", newCategory });
});
// *************************get all categories**********************
const getAllcategories = errorHandler(async (req, res, next) => {
  let APIFeature = new APIFeatures(categoryModel.find(), req.query)
    .Pagination()
    .Sort()
    .Filter()
    .Fields()
    .Search();
  let categories = await APIFeature.mongooseQuery;

  res.json({ message: "success", page: APIFeature.page, categories });
});
// *************************get category by id************************
const getCategoryById = getOne(categoryModel);
// *************************update category*************************
const updateCategory = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;
  let category = await categoryModel.findById(id);
  if (!category) return next(new AppError("Category Not Found!", 404));
  var oldImgId = category.image.public_id;
  // console.log(oldImgId);
  if (name) {
    req.body.slug = slugify(name.toLowerCase());
  }

  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "Ecommerce/category",
      }
    );
    req.body.image = { secure_url, public_id };
    await cloudinary.uploader.destroy(oldImgId);
  }
  let newCategory = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json({ message: "success", newCategory });
});

// ******************************delete category****************************
const deleteCategory = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let category = await categoryModel.findById(id);
  if (!category) return next(new AppError("category not found", 404));
  var oldImgId = category.image.public_id;
  let deletedCategory = await categoryModel.findByIdAndDelete(id);

  await cloudinary.uploader.destroy(oldImgId);
  res.json({ message: "success", deletedCategory });
});

export {
  createCategory,
  getAllcategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
