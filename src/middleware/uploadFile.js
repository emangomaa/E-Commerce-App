import multer from "multer";
import fs from "fs";
import path from "path";
// generate unique string
import { nanoid } from "nanoid";
import { AppError } from "../utils/AppError.js";

export const validFiles = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  pdf: ["application/pdf"],
};
const uploadFile = (castumPath, castumExtention) => {
  if (!castumPath) {
    castumPath = "/general";
  }
  let fullPath = path.resolve(`uploads${castumPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    // destination المكان اللي بخزن فيه الفايل

    destination: function (req, file, cb) {
      cb(null, fullPath);
    },

    // file name  اسم الفايل اللي هيتخزن
    filename: function (req, file, cb) {
      cb(null, nanoid(5) + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("invalid extention", 400), false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};

export default uploadFile;
