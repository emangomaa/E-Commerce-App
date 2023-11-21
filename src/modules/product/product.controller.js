import slugify from "slugify";
import productModel from "../../../database/models/product.model.js";
import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../../utils/AppError.js";
import { getOne } from "../../utils/handlers/refactor.handler.js";
import APIFeatures from "../../utils/APIFeatures.js";
import cloudinary from "../../utils/cloudinary.js";
import uploadFilesHandler from "../../utils/handlers/uploadFiles.handler.js";
// ***************************create Product**************************
const createProduct = errorHandler(async (req, res, next) => {
  let { name } = req.body;
  req.body.slug = slugify(name);
  let productExist = await productModel.findOne({ name });
  if (productExist) return next(new AppError("Product Already Exist!", 400));

  // handler for cloudnary upload logic
  if (!req.files) return next(new AppError("invalid image", 400));

  let files = await uploadFilesHandler(req.files);
  req.body.images = files.imgArr;
  req.body.coverImage = files.coverImage;
  req.body.imgsFolder = files.imgsFolder;
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  let product = new productModel(req.body);
  let newProduct = await product.save();

  res.json({ message: "success", newProduct });
});
// *************************get all products**********************
const getAllProducts = errorHandler(async (req, res, next) => {
  if (req.params && req.params.id) {
    let filterKey = req.originalUrl.split("/")[3];
    let products = await productModel.find({ [filterKey]: req.params.id });
    res.json({ message: "success", products });
  } else {
    let APIFeature = new APIFeatures(productModel.find(), req.query)
      .Pagination()
      .Sort()
      .Filter()
      .Fields()
      .Search();
    let products = await APIFeature.mongooseQuery;

    res.json({ message: "success", page: APIFeature.page, products });
  }
});

// *************************get Product by id************************
const getProductById = getOne(productModel);
// *************************update Product*************************
const updateProduct = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let product = await productModel.findById(id);
  if (!product) return next(new AppError("Product Not Found!", 404));

  let oldImgsFolder = product.imgsFolder;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  if (req.files) {
    var files = await uploadFilesHandler(req.files);
  }

  req.body.coverImage = files.coverImage;
  req.body.images = files.imgArr;
  req.body.imgsFolder = files.imgsFolder;
  req.body.updatedBy = req.user._id;
  let newProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  //   delete old images folder after update
  await cloudinary.api.delete_resources_by_prefix(
    oldImgsFolder,
    async function (err, result) {
      console.log(err);
      await cloudinary.api.delete_folder(oldImgsFolder, function (err, result) {
        console.log(err);
      });
    }
  );

  res.json({ message: "success", newProduct });
});

// ******************************delete Product****************************
const deleteProduct = errorHandler(async (req, res, next) => {
  let { id } = req.params;
  let product = await productModel.findByIdAndDelete(id);
  !product && next(new AppError("not found", 404));
  if (product) {
    await cloudinary.api.delete_resources_by_prefix(
      product.imgsFolder,
      async function (err, result) {
        console.log(err);
        await cloudinary.api.delete_folder(
          product.imgsFolder,
          function (err, result) {
            console.log(err);
          }
        );
      }
    );
    res.json({ message: "success", product });
  }
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
