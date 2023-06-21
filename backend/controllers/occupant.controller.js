const db = require("../models/index");
const expressAsyncHandler = require("express-async-handler");
const { Sequelize } = require("sequelize");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// get using services;
exports.getUsingServices = async (req) => {
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
  return usingServices;
};

// get not using services
exports.getNotUsingServices = async (req) => {
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
  return notUsingServices;
};

// add services
exports.addServices = async (user, body) => {
  // get the servicesDatils of occupant
  let serviceDetails = await db.Services.findOne({
    where: { occupant_id: user.user_id },
  });

  let services = body.services;

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

  // update service details of occupant
  let [updates] = await db.Services.update(addServices, {
    where: { occupant_id: user.user_id },
  });

  // get the latest details
  let updatedServiceDetails = await db.Services.findOne({
    where: { occupant_id: user.user_id },
  });

  return updatedServiceDetails;
};

// stop services
exports.stopService = async (user, body) => {
  let { service } = body;
  const t = await db.sequelize.transaction();

  try {
    // get the service starts date
    let result = await db.Services.findOne({
      where: { occupant_id: user.user_id },
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

    no_of_days = Math.ceil((end_date - start_date) / (1000 * 60 * 60 * 24));

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
        occupant_id: user.user_id,
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
          occupant_id: user.user_id,
          [`${service}_bill`]: billAmount,
          billed_date: end_date,
        },
        { transaction: t }
      );
    }

    // update service end date in services

    await db.Services.update(
      { [`${service}_ends`]: end_date },
      { where: { occupant_id: user.user_id }, transaction: t }
    );
    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};

// update profile
exports.updateProfile = async (user, body) => {
  let [updates] = await db.Occupants.update(body, {
    where: { occupant_id: user.user_id },
  });

  // get the latest details
  let updatedOccupant = await db.Occupants.findByPk(user.user_id);
  return updatedOccupant;
};

// get profile
exports.getProfile = async (user) => {
  let occupant = await db.Occupants.findByPk(user.user_id, {
    include: [{ model: db.Flats, include: [{ model: db.Owners }] }],
  });
  return occupant;
};

exports.getBill = async (user, params) => {
  let month = parseInt(params.month) - 1;
  let year = parseInt(params.year);

  // bill is calculated on next month

  // Calculate the next month and year
  let nextMonth = (month + 1) % 12;
  let nextMonthYear = month === 11 ? year + 1 : year;
  let nextMonthFirstDate = new Date(nextMonthYear, nextMonth, 1);
  let nextMonthLastDate = new Date(nextMonthYear, nextMonth + 1, 0);

  // get the bill
  let billRecord = await db.Bills.findOne({
    where: {
      occupant_id: user.user_id,
      billed_date: {
        [Sequelize.Op.between]: [nextMonthFirstDate, nextMonthLastDate],
      },
    },
    order: [["id", "desc"]],
  });
  return billRecord;
};

// create payment session
exports.createPaymentSession = async (params) => {
  try {
    let bill_id = params.bill_id;
    // get the bill detais
    let bill_details = await db.Bills.findByPk(bill_id);
    if (!bill_details) throw new Error("Invalid Bill Id");
    if (!bill_details.total_bill) {
      throw new Error("Bill is not calculated");
    } else if (bill_details.bill_status) {
      throw new Error("Bill is already paid");
    } else {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              unit_amount: bill_details.total_bill * 100,
              product_data: {
                name: "Monthly bill",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.PAYMENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.PAYMENT_FAILURE_URL}`,
        metadata: {
          occupant_id: bill_details.occupant_id,
          bill_id: bill_id,
        },
      });
      return session.url;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

// after successfullPayment
exports.successfullPayment = async (params) => {
  let session_id = params.session_id;
  let sessionObj = await stripe.checkout.sessions.retrieve(session_id);
  if (sessionObj.payment_status == "paid") {
    let updates = await db.Bills.update(
      {
        paid_date: new Date(),
        bill_status: true,
      },
      {
        where: {
          id: Number(sessionObj.metadata.bill_id),
        },
      }
    );
    if (updates) return true;
    else return false;
  }
};
