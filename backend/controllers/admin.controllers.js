const { Association } = require("sequelize");
const db = require("../models/index");
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

// add occupant
const addOccupant = expressAsyncHandler(async (req, res) => {
  // if occupied_from is not found then add today's date
  if (!req.body.occupied_from) {
    req.body.occupied_from = new Date();
  }
  console.log(req.body);
  let occupant = await db.Occupants.create(req.body);
  // assign flat to this occupant
  console.log(occupant);
  await db.Flats.update(
    {
      occupant_id: occupant.dataValues.occupant_id,
      ownership: req.body.flat.ownership,
      flat_status: true,
    },
    {
      where: {
        block: req.body.flat.block,
        flat_number: req.body.flat.flat_number,
      },
    }
  );

  res.send({ message: "Ocuppant added succesfully", payload: occupant });
});

// get occupant
const getOccupant = expressAsyncHandler(async (req, res) => {
  let occupant = await db.Occupants.findOne({
    where: {
      occupant_id: req.params.occupant_id,
    },
    include: [db.Flats],
  });
  if (occupant) res.send(occupant);
  else {
    res.send({ alertMsg: "No Occupant found" });
  }
});
// update occupant
const updateOccupant = expressAsyncHandler(async (req, res) => {
  console.log(req.params.occupant_id);
  let [updates] = await db.Occupants.update(req.body, {
    where: {
      occupant_id: req.params.occupant_id,
    },
  });
  console.log(updates);
  // get updated occupant details
  let updatedDetails = await db.Occupants.findByPk(req.params.occupant_id);
  if (updates) {
    res.send({ message: "Updation successfull", payload: updatedDetails });
  } else {
    res.send({ alertMsg: "Something went wrong... updation failed" });
  }
});

// delete / remove occupant
const deleteOccupant = expressAsyncHandler(async (req, res) => {
  //set ownership and occupant_id to null and flat status to false in flats
  // add vacated_at as today's date in occupants
  const t = await db.sequelize.transaction();
  try {
    await db.Flats.update(
      { ownership: null, occupant_id: null, flat_staus: true },
      { where: { occupant_id: req.params.occupant_id } },
      { transaction: t }
    );
    await db.Occupants.update(
      { vacated_at: new Date() },
      { where: { occupant_id: req.params.occupant_id } },
      { transaction: t }
    );

    await t.commit();
    res.send({ message: "Occupant removed successfully" });
  } catch (err) {
    await t.rollback();
    res.send({ alertMsg: "Something went wrong... please try again" });
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
  addOccupant,
  getOccupant,
  updateOccupant,
  deleteOccupant,
};
