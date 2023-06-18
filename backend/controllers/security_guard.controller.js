const db = require("../models/index");
const { Sequelize } = require("sequelize");
const expressAsyncHandler = require("express-async-handler");

// request handlers / controllers
exports.getFlatDetails = expressAsyncHandler(async (req, res) => {
  let flatDetails = await db.Flats.findAll({
    include: [
      { model: db.Owners, attributes: ["name", "phone"] },
      { model: db.Occupants, attributes: ["occupant_name", "phone"] },
    ],
    attributes: ["block", "flat_number"],
  });

  res.status(200).send(flatDetails);
});

//add visitor record
exports.addVisitorRecord = expressAsyncHandler(async (req, res) => {
  // add authrized_by property to req body and visisted_at as current date and time
  req.body.authorized_by = req.user.user_id;
  req.body.visited_at = new Date();

  let visitorRecord = await db.Visitors_record.create(req.body);
  res
    .status(201)
    .send({ message: "visitor recorded noted", payload: visitorRecord });
});

// get all vistors records who are not vacated yet
exports.getNotVacatedVisitorsRecords = expressAsyncHandler(async (req, res) => {
  let notVacatedVisitorsRecord = await db.Visitors_record.findAll({
    where: { returned_at: null },
    order: [["visited_at", "desc"]],
  });

  res.status(200).send(notVacatedVisitorsRecord);
});

// update visitors_record
exports.updateVisitorRecord = expressAsyncHandler(async (req, res) => {
  let [updates] = await db.Visitors_record.update(req.body, {
    where: { id: req.params.id },
  });

  if (updates) {
    res.status(200).send({ message: "Visitor record Updated" });
  } else {
    res.status(404).send({ alertMsg: "No updates found" });
  }
});

// returned time note
exports.visitorReturned = expressAsyncHandler(async (req, res) => {
  let [updates] = await db.Visitors_record.update(
    { returned_at: new Date() },
    { where: { id: req.params.id, returned_at: null } }
  );
  if (updates) {
    let record = await db.Visitors_record.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Returned Noted", payload: record });
  } else {
    res
      .status(500)
      .send({ alertMsg: "Something went wrong.... please try again" });
  }
});
// get the records from dateTime
exports.getVisitorsRecordOnParticularTime = expressAsyncHandler(
  async (req, res) => {
    let startTime = req.body.start_time;
    let endTime;
    if (req.body.end_time) endTime = req.body.end_time;
    else endTime = new Date();

    // fetch the records
    let records = await db.Visitors_record.findAll({
      where: {
        [Sequelize.Op.or]: [
          { visited_at: { [Sequelize.Op.between]: [startTime, endTime] } },
          { returned_at: { [Sequelize.Op.between]: [startTime, endTime] } },
        ],
      },
      order: [
        ["returned_at", "desc"],
        ["visited_at", "desc"],
      ],
    });
    records.length
      ? res.status(200).send(records)
      : res
          .status(404)
          .send({ alertMsg: "No records found between given time" });
  }
);

// get all visitors record
exports.getAllVisitorsRecord = expressAsyncHandler(async (req, res) => {
  let records = await db.Visitors_record.findAll({
    order: [["visited_at", "desc"]],
  });
  res.status(200).send(records);
});
