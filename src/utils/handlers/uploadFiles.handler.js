import cloudinary from "../cloudinary.js";
import { nanoid } from "nanoid";
import { AppError } from "../AppError.js";
const uploadFilesHandler = async (files) => {
  let imgsFolder = nanoid(5) + Date.now();
  if (files.coverImage) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      files.coverImage[0].path,
      { folder: `Ecommerce/products/${imgsFolder}` }
    );
    var coverImage = { secure_url, public_id };
  }

  let imgArr = [];
  if (files.images) {
    for (const file of files.images) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `Ecommerce/products/${imgsFolder}`,
        }
      );
      imgArr.push({ secure_url, public_id });
    }
  }
  return { coverImage, imgArr, imgsFolder: `Ecommerce/products/${imgsFolder}` };
};

export default uploadFilesHandler;
