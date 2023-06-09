const cron = require("node-cron");
const billCalculation = require("./bill_calculation");
// const sendBill = require("./send_bill");
const billSchedule = cron.schedule("*/10 * * * * *", async () => {
  // calculate bill
  await billCalculation();
});
billSchedule.start();
module.exports = billSchedule;