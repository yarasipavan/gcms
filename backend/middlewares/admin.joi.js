const Joi = require("joi");
const addFlatSchema = Joi.object().keys({
  block: Joi.string().required(),
  flat_number: Joi.number().required(),
});

const addOwnerSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
  Flats: Joi.array().items(
    Joi.object().keys({
      block: Joi.string().required(),
      flat_number: Joi.number().required(),
    })
  ),
});

const updateOwnerDetailsSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
});

exports.addFlatMiddleware = (req, res, next) => {
  const { error } = addFlatSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

exports.addOwnerMiddleware = (req, res, next) => {
  const { error } = addOwnerSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

exports.updateOwnerDetailsMiddleware = (req, res, next) => {
  const { error } = updateOwnerDetailsSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const changeOwnerSchema = Joi.object().keys({
  owner_id: Joi.number().required(),
  block: Joi.string().required(),
  flat_number: Joi.number().required(),
});
exports.changeOwnerJoi = (req, res, next) => {
  const { error } = changeOwnerSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const addOccupantSchema = Joi.object().keys({
  occupant_name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
  flat: Joi.object().keys({
    block: Joi.string().required(),
    flat_number: Joi.number().required(),
    ownership: Joi.string().required(),
    rent: Joi.number(),
  }),
});

exports.addOccupantJoi = (req, res, next) => {
  const { error } = addOccupantSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const updateOccupantSchema = Joi.object().keys({
  occupant_name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
  occupied_from: Joi.date(),
});

exports.updateOccupantJoi = (req, res, next) => {
  const { error } = updateOccupantSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const removeOccupantSchema = Joi.object().keys({
  occupant_id: Joi.number().required(),
});

exports.removeOccupantJoi = (req, res, next) => {
  const { error } = removeOccupantSchema.validate(req.params);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// add security guard
const addSecurityGuardSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

exports.addSecurityGuardJoi = (req, res, next) => {
  const { error } = addSecurityGuardSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const updateSecurityGuardSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
});
exports.updateSecurityGuardJoi = (req, res, next) => {
  const { error } = updateSecurityGuardSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// delet security
const deleteSecurityGuardSchema = Joi.object().keys({
  id: Joi.number().required(),
});

exports.deleteSecurityGuardJoi = (req, res, next) => {
  const { error } = deleteSecurityGuardSchema.validate(req.params);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

const updateServiceChargesSchema = Joi.object().keys({
  swimming_pool: Joi.number(),
  house_keeping: Joi.number(),
  parking: Joi.number(),
  park: Joi.number(),
  gym: Joi.number(),
  indoor_auditorium: Joi.number(),
  security: Joi.number(),
  maintenance: Joi.number(),
  gardening: Joi.number(),
  charity: Joi.number(),
  community: Joi.number(),
});
exports.updateServiceChargesJoi = (req, res, next) => {
  const { error } = updateServiceChargesSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// get bill
const getBillSchema = Joi.object().keys({
  occupant_id: Joi.number().required(),
  year: Joi.number().required(),
  month: Joi.number().required(),
});

exports.getBillJoi = (req, res, next) => {
  const { error } = getBillSchema.validate(req.params);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};

// send mails to occupants

const sendMailsSchema = Joi.object().keys({
  text: Joi.string().required(),
  subject: Joi.string().required(),
});

exports.sendMailsJoi = (req, res, next) => {
  const { error } = sendMailsSchema.validate(req.body);
  if (!error) {
    next();
  } else {
    res.status(422).send({ alertMsg: "Invalid required fields" });
  }
};
