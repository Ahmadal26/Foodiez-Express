const { check, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    // Must be at least 8 characters long
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  console.log(errors);
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
module.exports = {
  validationRules,
  validateFields,
};
