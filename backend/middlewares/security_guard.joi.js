const Joi = require("joi");

// add visitor
const addVisitorSchema = Joi.object().keys({
  visitor_name: Joi.string().required().min(3),
  visitor_aadhar: Joi.number().required().min(100000000000),
  block: Joi.string(),
  flat_number: Joi.number(),
  purpose: Joi.string().required(),
  visited_at: Joi.date(),
  phone: Joi.number().min(1000000000).max(9999999999).required(),
});

exports.addVisitorJoi = (req, res, next) => {
  const { error } = addVisitorSchema.validate(req.body, { abortEarly: false });
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// return time note
const returnTimeSchema = Joi.object().keys({ id: Joi.number().required() });
exports.returnTimeJoi = (req, res, next) => {
  const { error } = returnTimeSchema.validate(req.params);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// update visitors record
const updateVisitorsRecordBodySchema = Joi.object().keys({
  visitor_name: Joi.string().min(3),
  visitor_aadhar: Joi.number().min(100000000000),
  block: Joi.string(),
  flat_number: Joi.number(),
  purpose: Joi.string(),
  phone: Joi.number().min(1000000000).max(9999999999),
});
const updateVisitorsRecordParamsSchema = Joi.object().keys({
  id: Joi.number().required(),
});

exports.updateVisitorsRecordJoi = (req, res, next) => {
  const { error: errorInParams } = updateVisitorsRecordParamsSchema.validate(
    req.params
  );
  if (!errorInParams) {
    const { error: errorInBody } = updateVisitorsRecordBodySchema.validate(
      req.body
    );
    if (!errorInBody) next();
    else {
      res.status(422).send({ alertMsg: "Invalid required fields" });
    }
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// get records of particulat time
const getVisitorsRecordOnTimeSchema = Joi.object().keys({
  start_time: Joi.date().required(),
  end_time: Joi.date(),
});
exports.getVisitorsRecordOnTimeJoi = (req, res, next) => {
  console.log(req.body);
  const { error } = getVisitorsRecordOnTimeSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};
