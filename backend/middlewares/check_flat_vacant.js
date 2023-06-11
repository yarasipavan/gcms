const db = require("../models/index");
const check_flat_vacant = async (req, res, next) => {
  // check whether the flat status is false or not .ie vacant or not
  let result = await db.Flats.findOne({
    attributes: ["flat_status"],

    where: {
      block: req.body.flat.block,
      flat_number: req.body.flat.flat_number,
    },
  });
  if (result.flat_status) {
    res.send({ alerMsg: "Flat is already occupied" });
  } else {
    next();
  }
};
module.exports = check_flat_vacant;
