import errorHandler from "../../middleware/errorHandler.js";
import { AppError } from "../AppError.js";
const deleteOne = (model) => {
  return errorHandler(async (req, res, next) => {
    let { id } = req.params;
    let deleted = await model.findByIdAndDelete(id);

    !deleted && next(new AppError("not found", 404));
    deleted && res.json({ message: "success", deleted });
  });
};

const getOne = (model) => {
  return errorHandler(async (req, res, next) => {
    let { id } = req.params;
    let oneExist = await model.findById(id);
    !oneExist && next(new AppError("not found", 404));
    oneExist && res.json({ message: "success", oneExist });
  });
};

export { deleteOne, getOne };
