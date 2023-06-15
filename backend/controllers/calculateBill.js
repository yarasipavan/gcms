const db = require("../models/index");
const { Sequelize } = require("sequelize");
const sendBill = require("../schedule/send_bill");
exports.calculateBill = async (occupant_id, t) => {
  // get the occupant details
  let occupant = await db.Occupants.findByPk(
    occupant_id,

    { transaction: t }
  );

  // get service charges
  const services = await db.Service_charges.findOne({
    order: [["id", "desc"]],
    attributes: { exclude: ["id"] },
    transaction: t,
  });

  const charges = {};

  let serviceDetails = await db.Services.findOne({
    where: {
      occupant_id: occupant_id,
    },
    transaction: t,
  });
  let today = new Date();
  let occupied_date = new Date(occupant.occupied_from);
  let days = today.getDate();
  if (occupied_date.getMonth() == today.getMonth()) {
    days = Math.ceil((today - occupied_date) / (1000 * 60 * 60 * 24));
  }
  console.log(days);
  //  find the no. of days of each service and calculate the bill and add to charges
  for (let service in services.dataValues) {
    // get the service start date from service details only if service end is null .. i.e using service
    let no_of_days;
    if (
      serviceDetails[`${service}_ends`] == null &&
      serviceDetails[`${service}_starts`] != null
    ) {
      let start_date = serviceDetails[`${service}_starts`];

      // if(start date is not last month then ) then make the charges are no need to calculate just assign the charges
      if (start_date.getMonth() != today.getMonth()) {
        // assume start date has 1st of this month
        start_date = new Date(today.getFullYear(), today.getMonth(), 1);
      }

      let charge = Math.ceil((services[`${service}`] / 30) * days);
      charges[`${service}_bill`] = charge;
    } else if (serviceDetails[`${service}_starts`] === undefined) {
      console.log((services[`${service}`] / 30) * today.getDate());
      charges[`${service}_bill`] = Math.ceil(
        (services[`${service}`] / 30) * days
      );
    } else {
      charges[`${service}_bill`] = 0;
    }
  }

  // get the rent value from flat and add to charges
  let rentRecord = await db.Flats.findOne({
    where: { occupant_id: occupant_id },
    attributes: ["rent"],
    transaction: t,
  });
  charges["rent_bill"] =
    rentRecord?.rent > 0 ? Math.ceil((rentRecord.rent / 30) * days) : 0;

  // if bill record of this month is already existed then update that record
  // else add i.e create bill record

  let startMonthDate = new Date(today.getFullYear(), today.getMonth(), 2);

  // get bill details
  let billRecord = await db.Bills.findOne({
    where: {
      billed_date: {
        [Sequelize.Op.between]: [startMonthDate, today],
      },
      occupant_id: occupant_id,
    },
    transaction: t,
  });

  // bill record is found then update
  if (billRecord) {
    // update the charges i.e if add to the previously calculated bill
    let total_bill = 0;
    for (let bill in charges) {
      charges[bill] += billRecord[bill];
      total_bill += charges[bill];
    }

    // add few more details to charges  to update
    charges["billed_date"] = new Date();
    charges["total_bill"] = total_bill;

    console.log("******", charges);
    await db.Bills.update(charges, {
      where: { occupant_id: occupant.occupant_id },
      transaction: t,
    });
  }
  // if recored is not found then create bill record
  else {
    total_bill = 0;
    for (let bill in charges) {
      total_bill += charges[bill];
    }

    // add few more details to charged to create record
    charges["occupant_id"] = occupant.occupant_id;
    charges["total_bill"] = total_bill;
    charges["billed_date"] = new Date();

    await db.Bills.create(charges, { transaction: t });
  }
  // send mail
  await sendBill(occupant.email, charges);
};
