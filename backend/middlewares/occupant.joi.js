const Joi = require("joi");

// add services
const addServicesSchema = Joi.object().keys({
  services: Joi.array().items(
    Joi.string()
      .required()
      .valid(
        "swimming_pool",
        "house_keeping",
        "parking",
        "park",
        "indoor_auditorium",
        "gym"
      )
  ),
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
  service: Joi.string()
    .required()
    .valid(
      "swimming_pool",
      "house_keeping",
      "parking",
      "park",
      "indoor_auditorium",
      "gym"
    ),
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
  name: Joi.string().min(3),
  phone: Joi.number().min(1000000000).max(9999999999),
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
  year: Joi.number().required().min(2022).max(new Date().getFullYear()),
  month: Joi.number().required().min(1).max(12),
});

exports.getBillJoi = (req, res, next) => {
  const { error } = getBillSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};
