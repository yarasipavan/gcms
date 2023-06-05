const { Association } = require("sequelize");
const db = require("../models/index");
console.log(db.Flats);
const expressAsyncHandler = require("express-async-handler");

// get flat details
const getFlatsDetails = expressAsyncHandler(async (req, res) => {
  let flats = await db.Flats.findAll({
    include: [{ model: db.Owners }, { model: db.Occupants }],
  });
  res.json(flats);
});

// add flat
const addFlat = expressAsyncHandler(async (req, res) => {
  // check whether the flat is already existed or not
  let flat = await db.Flats.findOne({
    where: {
      block: req.body.block,
      flat_number: req.body.flat_number,
    },
  });
  if (flat != null) {
    res.status(400).send({ alertMsg: "flat already exists" });
  } else {
    let flat = await db.Flats.create(req.body);
    res.send({ message: "Flat added successfully", payload: flat });
  }
});

// update flat
const updateFlat = expressAsyncHandler(async (req, res) => {
  let [updatedDetails] = await db.Flats.update(req.body, {
    where: {
      block: req.params.block,
      flat_number: req.params.flat_number,
    },
  });

  if (updatedDetails) {
    res.send({ message: "Flat details updated successfully" });
  } else {
    res
      .status(400)
      .send({ alertMsg: "Something went wrong... updation failed" });
  }
});
// delete Flat

const deleteFlat = expressAsyncHandler(async (req, res) => {
  console.log("hhhhh");
  let deletedFlat = await db.Flats.destroy({
    where: {
      block: req.params.block,
      flat_number: req.params.flat_number,
    },
  });
  if (deletedFlat) {
    res.send({ message: "Flat deleted successfully" });
  } else {
    res.send({ alertMsg: "Something went wrong... flat deletion failed" });
  }
});

// get owner
const getOwner = expressAsyncHandler(async (req, res) => {
  let owner = await db.Owners.findByPk(req.params.owner_id, {
    include: "Flats",
  });
  res.send(owner);
});

// add owner
const addOwner = expressAsyncHandler(async (req, res) => {
  let newOwner = await db.Owners.create(req.body);
  console.log(newOwner.dataValues["owner_id"]);
  // assign flat to owner
  await req.body.Flats.map((flat) => {
    db.Flats.update(
      { owner_id: newOwner.dataValues["owner_id"] },
      {
        where: {
          block: flat.block,
          flat_number: flat.flat_number,
        },
      }
    );
  });
  res.send({ message: "Owner added successfully", payload: newOwner });
});

// update change owner
const updateOwner = expressAsyncHandler(async (req, res) => {
  // update the details
  let [updations] = await db.Owners.update(req.body, {
    where: {
      owner_id: req.params.owner_id,
    },
  });

  // get the updated owner details
  let updatedOwner = await db.Owners.findByPk(req.params.owner_id);
  if (updations) {
    res.send({
      message: "Owner details updated successfully",
      payload: updatedOwner,
    });
  } else {
    res.send({
      alertMsg: "Something went wrong.... owner details updation failed",
    });
  }
});

// delete owner
const deleteOwner = expressAsyncHandler(async (req, res) => {
  let deletions = await db.Owners.destroy({
    where: {
      owner_id: req.params.owner_id,
    },
  });
  if (deletions) {
    res.send({ message: "Owner deleted successfully" });
  } else {
    res.send({ alertMsg: "Something went wrong... owner deletion failed " });
  }
});

// change owner
const changeOwner = expressAsyncHandler(async (req, res) => {
  let [updations] = await db.Flats.update(
    { owner_id: req.body.owner_id },
    {
      where: {
        block: req.body.block,
        flat_number: req.body.flat_number,
      },
    }
  );

  if (updations) {
    res.send({ message: "owner changed successfully" });
  } else {
    res.send({ alertMsg: "Something went wrong..." });
  }
});

module.exports = {
  getFlatsDetails,
  addFlat,
  updateFlat,
  deleteFlat,
  getOwner,
  addOwner,
  updateOwner,
  deleteOwner,
  changeOwner,
};
