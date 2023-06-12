const db = require("../models/index");
const { Sequelize } = require("sequelize");
const sendBill = require("./send_bill");

const billCalculation = async () => {
  // get the occupant id whose are not vacated
  const t = await db.sequelize.transaction();
  try {
    let occupants = await db.Occupants.findAll({
      where: {
        vacated_at: null,
      },
      transaction: t,
    });
    // get service charges
    const services = await db.Service_charges.findOne({
      order: [["id", "desc"]],
      attributes: { exclude: ["id"] },
      transaction: t,
    });

    // note : the attributes of service charges are services names
    await Promise.all(
      occupants.map(async (occupant) => {
        //  get the service details i.e start date and end data
        const charges = {};

        let serviceDetails = await db.Services.findOne({
          where: {
            occupant_id: occupant.occupant_id,
          },
          transaction: t,
        });

        //  find the no. of days of each service and calculate the bill and add to charges
        for (let service in services.dataValues) {
          // get the service start date from service details only if service end is null .. i.e using service

          if (
            serviceDetails[`${service}_ends`] == null &&
            serviceDetails[`${service}_starts`] != null
          ) {
            let start_date = serviceDetails[`${service}_starts`];
            let today = new Date();
            // if(start date is not last month then ) then make the charges are no need to calculate just assign the charges
            if (start_date.getMonth() != today.getMonth() - 1) {
              charges[`${service}_bill`] = services[`${service}`];
            } else {
              // calculate no. of days
              let no_of_days = Math.floor(
                (today - start_date) / (1000 * 60 * 60 * 24)
              );
              let charge = Math.ceil(
                (services[`${service}`] / 30) * no_of_days
              );
              charges[`${service}_bill`] = charge;
            }
          } else if (serviceDetails[`${service}_starts`] === undefined) {
            charges[`${service}_bill`] = services[`${service}`];
          } else {
            charges[`${service}_bill`] = 0;
          }
        }

        // get the rent value from flat and add to charges
        let rentRecord = await db.Flats.findOne({
          where: { occupant_id: occupant.occupant_id },
          attributes: ["rent"],
          transaction: t,
        });
        console.log(rentRecord);
        charges["rent_bill"] = rentRecord?.rent;

        // if bill record of last month is already existed then update that record
        // else add i.e create bill record

        // calculate last month 1st date and last month last date
        let currentDate = new Date(); // todays date
        currentDate.setDate(1); //sets the date to 1 of this month
        currentDate.setDate(0); // if 1 substracted form above date then get last month last date
        let last_bill_date = new Date(currentDate);
        currentDate.setDate(1); // last month first date
        let start_bill_date = new Date(currentDate);

        let billRecord = await db.Bills.findOne({
          where: {
            billed_date: {
              [Sequelize.Op.between]: [start_bill_date, last_bill_date],
            },
            occupant_id: occupant.occupant_id,
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
      })
    );

    await t.commit();
    console.log("bill calculated");
  } catch (err) {
    t.rollback();
    console.log("Some thing went wrong.....");
    console.log(err);
  }
};

module.exports = billCalculation;
