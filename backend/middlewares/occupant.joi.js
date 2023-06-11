const Joi = require("joi");

// add services
const addServicesSchema = Joi.object().keys({
  services: Joi.array().items(Joi.string().required()),
});

exports.addServicesJoi = (req, res, next) => {
  const { error } = addServicesSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// delete service
const deleteServiceSchema = Joi.object().keys({
  service: Joi.string().required(),
});

exports.deleteServiceJoi = (req, res, next) => {
  console.log(req.body);
  const { error } = deleteServiceSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// update profile
const updateProfileSchema = Joi.object().keys({
  name: Joi.string(),
  phone: Joi.number(),
});

exports.updateProfileJoi = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// get bill
const getBillSchema = Joi.object().keys({
  year: Joi.number().required(),
  month: Joi.number().required(),
});

exports.getBillJoi = (req, res, next) => {
  const { error } = getBillSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};
