import slugify from "slugify";
import subCategoryModel from "../../../database/models/subCategory.model.js";
import categoryModel from "../../../database/models/category.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne, getOne } from "../../utils/handlers//refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";

// // ***********************create subCategory*****************************
const createSubCategory = errorHandler(async (req, res, next) => {
  let { name, category } = req.body;
  // check if category is existed
  let categoryExist = await categoryModel.findById(category);
  if (!categoryExist) return next(new AppError("category not exist ", 400));

  let subCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (subCategoryExist)
    return next(new AppError("subCategory already exist ", 400));

  req.body.slug = slugify(name.toLowerCase());
  let subCategory = new subCategoryModel({
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  let newSubCategory = await subCategory.save();
  res.status(201).json({ message: "success", newSubCategory });
});

// // ***************************get All subCategories***********************

const getAllSubCategories = async (req, res, next) => {
  let filters = {};
  if (req.params && req.params.id) {
    filters = { category: req.params.id };
    let subcategories = await subCategoryModel.find(filters);
    res.json({ message: "success", subcategories });
  } else {
    let APIFeature = new APIFeatures(subCategoryModel.find(), req.query)
      .Pagination()
      .Sort()
      .Search()
      .Filter()
      .Fields();
    let subcategories = await APIFeature.mongooseQuery;
    res.json({ message: "success", page: APIFeature.page, subcategories });
  }
};

// // ***********************get subCategory By id ***************************
const getSubCategoryById = getOne(subCategoryModel);

// // ******************update subCategory************************************
const updateSubCategory = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;

  let updated = await subCategoryModel.findByIdAndUpdate(
    id,
    { name: name.toLowerCase(), slug: slugify(name.toLowerCase()) },
    { new: true }
  );

  !updated && next(new AppError("subCategory not found", 404));
  updated && res.json({ message: "success", updated });
});

// // ************************delete subCategory***********************
const deleteSubCategory = deleteOne(subCategoryModel);
export {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
