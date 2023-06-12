const db = require("../models/index");
const { Sequelize } = require("sequelize");

const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const { transporter } = require("../custom_modules/transporter");
const { request } = require("express");

// methods
// method to generate password
const generatePassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

//  method to send the credentails to mail
const sendCredentials = async (email, password) => {
  var mailOptions = {
    from: "Admin",
    to: email,
    subject: "Login Credentials|Gated Community Management System -Testing",
    html: `<center></center><h5>Hey... Welcome</h5><center></center>
  <h6>Here is your Login Credentials</h6>
  <p>Username: ${email}</p>
  <p>Password: ${password}</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

// get flat details
const getFlatsDetails = expressAsyncHandler(async (req, res) => {
  let flats = await db.Flats.findAll({
    include: [{ model: db.Owners }, { model: db.Occupants }],
  });
  res.status(200).send(flats);
});

// get vacant flats
const getVacantFlats = expressAsyncHandler(async (req, res) => {
  let flats = await db.Flats.findAll({
    attributes: ["block", "flat_number"],
    where: { flat_status: 0 },
  });
  res.status(200).send({ message: "Vacant flats", payload: flats });
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
    res.status(409).send({ alertMsg: "flat already exists" });
  } else {
    let updated = await db.Flats.create(req.body);
    // get the latest details
    let flat = await db.Flats.findOne({
      include: [{ model: db.Owners }, { model: db.Occupants }],
      where: { block: updated.block, flat_number: updated.flat_number },
    });
    res.status(201).send({ message: "Flat added successfully", payload: flat });
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
    // get the updated flat details
    let flat = await db.Flats.findOne({
      include: [{ model: db.Owners }, { model: db.Occupants }],
      where: { block: req.body.block, flat_number: req.body.flat_number },
    });
    res
      .status(200)
      .send({ message: "Flat details updated successfully", payload: flat });
  } else {
    res
      .status(500)
      .send({ alertMsg: "Something went wrong... updation failed" });
  }
});
// delete Flat

const deleteFlat = expressAsyncHandler(async (req, res) => {
  let deletedFlat = await db.Flats.destroy({
    where: {
      block: req.params.block,
      flat_number: req.params.flat_number,
    },
  });
  if (deletedFlat) {
    res.status(200).send({ message: "Flat deleted successfully" });
  } else {
    res.send({ alertMsg: "Something went wrong... flat deletion failed" });
  }
});

// get owner
const getOwner = expressAsyncHandler(async (req, res) => {
  let owner = await db.Owners.findByPk(req.params.owner_id, {
    include: "Flats",
  });
  res.status(200).send(owner);
});

// get all owners
const getAllOwners = expressAsyncHandler(async (req, res) => {
  let owners = await db.Owners.findAll();
  res.send(owners);
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
  res
    .status(201)
    .send({ message: "Owner added successfully", payload: newOwner });
});

// update change owner
const updateOwner = expressAsyncHandler(async (req, res) => {
  console.log(req.params.owner_id);
  // update the details
  let [updations] = await db.Owners.update(req.body, {
    where: {
      owner_id: req.params.owner_id,
    },
  });
  if (updations) {
    // get the updated owner details
    let updatedOwner = await db.Owners.findByPk(req.params.owner_id);

    res.status(200).send({
      message: "Owner details updated successfully",
      payload: updatedOwner,
    });
  } else {
    res.status(200).send({
      alertMsg: "no updations found",
    });
  }
});

// delete owner
// const deleteOwner = expressAsyncHandler(async (req, res) => {
//   let deletions = await db.Owners.destroy({
//     where: {
//       owner_id: req.params.owner_id,
//     },
//   });
//   if (deletions) {
//     res.status(200).send({ message: "Owner deleted successfully" });
//   } else {
//     res.send({ alertMsg: "Something went wrong... owner deletion failed " });
//   }
// });

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
    res.status(200).send({ message: "owner changed successfully" });
  } else {
    res.send({ alertMsg: "Something went wrong..." });
  }
});

// add occupant
const addOccupant = expressAsyncHandler(async (req, res) => {
  // check email is already existed
  let record = await db.Credentials.findOne({
    where: { username: req.body.email, status: true },
  });
  if (record) {
    res.status(400).send({
      alertMsg: "Email already registered and in use.. try again with new one",
    });
  } else {
    // if occupied_from is not found then add today's date
    if (!req.body.occupied_from) {
      req.body.occupied_from = new Date();
    }

    const t = await db.sequelize.transaction();
    try {
      // create occupant
      let occupant = await db.Occupants.create(req.body, { transaction: t });

      let updatesInFlats = {
        occupant_id: occupant.occupant_id,
        ownership: req.body.flat.ownership,
        flat_status: true,
      };
      if (updatesInFlats["ownership"] == "tenant") {
        if (req.body.flat.rent) {
          updatesInFlats.rent = req.body.flat.rent;
        }
      } else {
        updatesInFlats.rent = 0;
      }

      await db.Flats.update(updatesInFlats, {
        where: {
          block: req.body.flat.block,
          flat_number: req.body.flat.flat_number,
        },
        transaction: t,
      });

      // add occupant id in services;
      await db.Services.create(
        { occupant_id: occupant.occupant_id },
        { transaction: t }
      );

      // generate credentails
      let password = generatePassword();
      let hashedPassword = await bcryptjs.hash(password, 5);
      let credentials = await db.Credentials.create(
        {
          username: req.body.email,
          password: hashedPassword,
          role: "occupant",
          user_id: occupant.dataValues.occupant_id,
        },
        { transaction: t }
      );

      // send credenatial to mail
      await sendCredentials(credentials.username, password);

      await t.commit();
      res.send({ message: "Ocuppant added succesfully", payload: occupant });
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.send({ alertMsg: "Something went wrong... occupant not added" });
    }
  }
});

// get occupant
const getOccupant = expressAsyncHandler(async (req, res) => {
  let occupant = await db.Occupants.findOne({
    where: {
      occupant_id: req.params.occupant_id,
    },
    include: [db.Flats],
  });
  if (occupant) res.status(200).send(occupant);
  else {
    res.status(404).send({ alertMsg: "No Occupant found" });
  }
});

// get all occupants
const getAllOccupants = expressAsyncHandler(async (req, res) => {
  let occupants = await db.Flats.findAll({
    where: {
      occupant_id: { [Sequelize.Op.not]: null },
    },
    include: [db.Occupants],
  });
  res.status(200).send(occupants);
});

const getOverallOccupants = expressAsyncHandler(async (req, res) => {
  let occupants = await db.Occupants.findAll();
  res.send(occupants);
});
// update occupant
const updateOccupant = expressAsyncHandler(async (req, res) => {
  console.log(req.params.occupant_id);
  let [updates] = await db.Occupants.update(req.body, {
    where: {
      occupant_id: req.params.occupant_id,
    },
  });
  // get updated occupant details
  let updatedDetails = await db.Occupants.findByPk(req.params.occupant_id);
  if (updates) {
    res
      .status(200)
      .send({ message: "Updation successfull", payload: updatedDetails });
  } else {
    res.status(404).send({ alertMsg: "No updations found" });
  }
});

// delete / remove occupant
const deleteOccupant = expressAsyncHandler(async (req, res) => {
  //set ownership and occupant_id to null and flat status to false in flats
  // add vacated_at as today's date in occupants
  const t = await db.sequelize.transaction();
  try {
    await db.Flats.update(
      { ownership: null, occupant_id: null, flat_status: false },
      { where: { occupant_id: req.params.occupant_id }, transaction: t }
    );
    await db.Occupants.update(
      { vacated_at: new Date() },
      { where: { occupant_id: req.params.occupant_id }, transaction: t }
    );

    await db.Credentials.update(
      {
        status: false,
      },
      {
        where: { user_id: req.params.occupant_id, role: "occupant" },
        transaction: t,
      }
    );
    await t.commit();
    res.status(200).send({ message: "Occupant removed successfully" });
  } catch (err) {
    await t.rollback();
    res
      .status(500)
      .send({ alertMsg: "Something went wrong... please try again" });
  }
});

// add security guard
const addSecurityGuard = expressAsyncHandler(async (req, res) => {
  // check email is already existed
  let record = await db.Credentials.findOne({
    where: { username: req.body.email, status: true },
  });
  if (record) {
    res.status(400).send({
      alertMsg: "Email already registered and in use.. try again with new one",
    });
  } else {
    const t = await db.sequelize.transaction();
    try {
      // add security guard details in security_guard
      let security = await db.Security_guard.create(req.body, {
        transaction: t,
      });

      // generate credentials and insert in credentails table
      let password = generatePassword();
      let hashedPassword = await bcryptjs.hash(password, 5);

      await db.Credentials.create(
        {
          user_id: security.id,
          username: security.email,
          password: hashedPassword,
          role: "security",
        },
        { transaction: t }
      );

      // send mail the credentials
      await sendCredentials(security.email, password);

      await t.commit();
      res
        .status(201)
        .send({ message: "security added successfully", payload: security });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res
        .status(500)
        .send({ alertMsg: "Something went wrong.. Security guard not added" });
    }
  }
});

// get security guard
const getSecurity = expressAsyncHandler(async (req, res) => {
  let security = await db.Security_guard.findByPk(req.params.id);
  if (security) {
    res.status(200).send({ message: "Security details", payload: security });
  } else {
    res.send({ alertMsg: `Security not found with id: ${req.params.id}` });
  }
});

// get all security
const getAllSecurity = expressAsyncHandler(async (req, res) => {
  // get all security id whose are active
  let records = await db.Credentials.findAll({
    where: { role: "security", status: true },
  });
  let ids = records.map((record) => record.user_id);

  let security = await db.Security_guard.findAll({
    where: { id: { [Sequelize.Op.in]: ids } },
  });
  res.send(security);
});
// update securty guard
const updateSecurity = expressAsyncHandler(async (req, res) => {
  let [updates] = await db.Security_guard.update(req.body, {
    where: { id: req.params.id },
  });

  if (updates) {
    // get updated details
    let updatedDetails = await db.Security_guard.findByPk(req.params.id);
    res
      .status(200)
      .send({ message: "Updation Successfull", payload: updatedDetails });
  } else {
    res.status(404).send({ alertMsg: "No updations found" });
  }
});
// remove security guard
const deleteSecurity = expressAsyncHandler(async (req, res) => {
  let [updates] = await db.Credentials.update(
    { status: false },
    { where: { user_id: req.params.id, role: "security" } }
  );
  if (updates) {
    res.status(200).send({ message: "Deletion successfull" });
  } else {
    res.send({ alertMsg: "Something went wrong... Deletion failed" });
  }
});

const getBill = expressAsyncHandler(async (req, res) => {
  let month = parseInt(req.params.month) - 1;
  let year = parseInt(req.params.year);

  // bill is calculated on next month

  let nextMonth = (month + 1) % 12;
  let nextMonthYear = month === 11 ? year + 1 : year;
  let nextMonthFirstDate = new Date(nextMonthYear, nextMonth, 1);
  let nextMonthLastDate = new Date(nextMonthYear, nextMonth + 1, 0);

  // get the bill
  let billRecord = await db.Bills.findOne({
    where: {
      occupant_id: req.params.occupant_id,
      billed_date: {
        [Sequelize.Op.between]: [nextMonthFirstDate, nextMonthLastDate],
      },
    },
  });
  if (billRecord) res.status(200).send(billRecord);
  else res.status(404).send({ alertMsg: "No billing found" });
});

const updateServiceCosts = expressAsyncHandler(async (req, res) => {
  await db.Service_charges.update(req.body, { where: { id: true } });
  res.status(200).send({ message: "Charges updated successfully" });
});

// send mail to all occupants
const sendMailToOccupants = expressAsyncHandler(async (req, res) => {
  let { subject, text } = req.body;
  // get the emails of all current occupants
  let emails = await db.Credentials.findAll({
    where: { role: "occupant", status: true },
    attributes: ["username"],
  });
  let emailArray = emails.map((credentials) => {
    return credentials.username;
  });
  console.log(emailArray);
  var mailOptions = {
    from: "Admin",
    to: emailArray,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ alertMsg: "Something Went wrong" });
    } else {
      res.send({ message: "Mails sent " });
    }
  });
});

module.exports = {
  getFlatsDetails,
  addFlat,
  updateFlat,
  deleteFlat,
  getOwner,
  getAllOwners,
  addOwner,
  updateOwner,
  changeOwner,
  addOccupant,
  getOccupant,
  getAllOccupants,
  getOverallOccupants,
  updateOccupant,
  deleteOccupant,
  getVacantFlats,
  addSecurityGuard,
  getSecurity,
  getAllSecurity,
  updateSecurity,
  deleteSecurity,
  getBill,
  updateServiceCosts,
  sendMailToOccupants,
};
