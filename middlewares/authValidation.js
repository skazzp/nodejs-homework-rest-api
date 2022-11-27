const validation = require('../validation/validation');

const authValidation = (req, res, next) => {
  const validationResult = validation.schemaUser.validate(req.body);
  if (validationResult.error) {
    const errorMsg = validationResult.error.details[0].message;
    console.log(errorMsg);
    return res.status(401).json({ message: errorMsg });
  }
  next();
};

module.exports = { authValidation };
