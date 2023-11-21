const validation = (schema) => {
  return (req, res, next) => {
    let inputs = { ...req.body, ...req.params, ...req.query };
    console.log(inputs);
    let { error } = schema.validate(inputs, { abortEarly: false });
    if (error) {
      res.status(400).json({ message: "error", error: error.details });
    } else {
      next();
    }
  };
};
export default validation;
