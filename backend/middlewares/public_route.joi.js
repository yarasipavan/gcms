const Joi = require("joi");
const { join } = require("path");

// login
const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginJoi = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

//change password
const changePasswordSchema = Joi.object().keys({
  old_password: Joi.string().min(8).required(),
  new_password: Joi.string().min(8).required(),
});
exports.changePasswordJoi = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// forgotPassword
const forgotPasswordLinkSchema = Joi.object().keys({
  username: Joi.string().required(),
});
exports.forgotPasswordLinkJoi = (req, res, next) => {
  const { error } = forgotPasswordLinkSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const resetPasswordSchema = Joi.object().keys({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
exports.resetPasswordJoi = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};
