const db = require("../models/index");
const expressAsyncHandler = require("express-async-handler");
const { Sequelize } = require("sequelize");

// get using services;
exports.getUsingServices = expressAsyncHandler(async (req, res) => {
  let serviceDetails = await db.Services.findOne({
    where: { occupant_id: req.user.user_id },
  });

  let usingServices = [];
  // get all services from services cost
  let service_cost = await db.Service_charges.findOne({
    order: [["id", "desc"]],
  });

  for (let service in service_cost.dataValues) {
    if (
      serviceDetails[`${service}_starts`] != null &&
      serviceDetails[`${service}_ends`] === null
    ) {
      usingServices.push(service);
    }
  }
  res.send(usingServices);
});

// get not using services
exports.getNotUsingServices = expressAsyncHandler(async (req, res) => {
  let serviceDetails = await db.Services.findOne({
    where: { occupant_id: req.user.user_id },
  });

  let notUsingServices = [];

  // get all services from services cost
  let service_cost = await db.Service_charges.findOne({
    order: [["id", "desc"]],
  });

  for (let service in service_cost.dataValues) {
    if (
      (serviceDetails[`${service}_starts`] != null &&
        serviceDetails[`${service}_ends`] != null) ||
      (serviceDetails[`${service}_starts`] === null &&
        serviceDetails[`${service}_ends`] === null)
    ) {
      notUsingServices.push(service);
    }
  }
  res.send(notUsingServices);
});

// add services
exports.addServices = expressAsyncHandler(async (req, res) => {
  // get the servicesDatils of occupant
  let serviceDetails = await db.Services.findOne({
    where: { occupant_id: req.user.user_id },
  });

  let services = req.body.services;

  let addServices = {};

  services.map((service) => {
    if (
      serviceDetails[`${service}_starts`] === null ||
      (serviceDetails[`${service}_starts`] && serviceDetails[`${service}_ends`])
    ) {
      addServices[`${service}_starts`] = new Date();
      addServices[`${service}_ends`] = null;
    }
  });
  console.log(addServices);

  // update service details of occupant
  let [updates] = await db.Services.update(addServices, {
    where: { occupant_id: req.user.user_id },
  });

  // get the latest details
  let updatedServiceDetails = await db.Services.findOne({
    where: { occupant_id: req.user.user_id },
  });

  if (updates) {
    res.status(201).send({
      message: "Services added successfully",
      payload: updatedServiceDetails,
    });
  } else {
    res.send({ alertMsg: "Something went wrong... please try again" });
  }
});

// stop services
exports.stopService = expressAsyncHandler(async (req, res) => {
  let { service } = req.body;
  const t = await db.sequelize.transaction();

  try {
    // get the service starts date
    let result = await db.Services.findOne({
      where: { occupant_id: req.user.user_id },
      attributes: [`${service}_starts`],
      transaction: t,
    });

    // calculate difference between result[${service}_starts] and todays day
    let start_date = new Date(result[`${service}_starts`]);
    let end_date = new Date();

    const year = end_date.getFullYear();
    const month = end_date.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    let no_of_days = 0;

    if (start_date <= firstOfMonth) {
      start_date = firstOfMonth;
    }

    no_of_days = Math.floor((end_date - start_date) / (1000 * 60 * 60 * 24));

    // get the cast of the service from service charges

    let charges = await db.Service_charges.findOne({
      order: [["id", "desc"]],
      attributes: [`${service}`],
      transaction: t,
    });

    // calculate bill
    let billAmount = Math.ceil((charges[`${service}`] / 30) * no_of_days);

    // get bill record of this month
    const currentMonth = end_date.getMonth() + 1; // Month is zero-based, so we add 1
    const currentYear = end_date.getFullYear();
    const start_bill_date = new Date(currentYear, currentMonth - 1, 1);
    const end_bill_date = new Date(currentYear, currentMonth, 0);

    let billRecord = await db.Bills.findOne({
      where: {
        billed_date: {
          [Sequelize.Op.between]: [start_bill_date, end_bill_date],
        },
        occupant_id: req.user.user_id,
      },
      transaction: t,
    });

    // if this amount bill record already existed then update the service bill
    if (billRecord) {
      await db.Bills.update(
        { [`${service}_bill`]: billRecord[`${service}_bill`] + billAmount },
        { where: { id: billRecord["id"] }, transaction: t }
      );
    }
    // else create bill record of this month
    else {
      await db.Bills.create(
        {
          occupant_id: req.user.user_id,
          [`${service}_bill`]: billAmount,
          billed_date: end_date,
        },
        { transaction: t }
      );
    }

    // update service end date in services

    await db.Services.update(
      { [`${service}_ends`]: end_date },
      { where: { occupant_id: req.user.user_id }, transaction: t }
    );

    await t.commit();
    res.send({ message: "service paused successfully" });
  } catch (err) {
    await t.rollback();
    console.log(err.message);
    res.send({ alertmsg: "Something went wrong.... service not stopped" });
  }
});
