// create mini express app
const express = require("express");
const router = express.Router();

// import middlewares
const check_flat_vacant = require("../middlewares/check_flat_vacant");

// body parser
router.use(express.json());

// import controllers
const {
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
  getVacantFlats,
  addSecurityGuard,
  getSecurity,
  updateSecurity,
  deleteSecurity,
  // sendMail,
} = require("../controllers/admin.controllers");

// routes

// get flat details
router.get("/flats-details", getFlatsDetails);

// get vacant flats
router.get("/vacant-flats", getVacantFlats);

// add flat
router.post("/flat", addFlat);

// update flat
router.put("/flat/block/:block/flat_number/:flat_number", updateFlat);

// delete flat
router.delete("/flat/block/:block/flat_number/:flat_number", deleteFlat);

// get owner
router.get("/owner/owner_id/:owner_id", getOwner);

// add owner
router.post("/owner", addOwner);

// update change owner
router.put("/owner/owner_id/:owner_id", updateOwner);

// delete owner
router.delete("/owner/owner_id/:owner_id", deleteOwner);

// change owner
router.put("/changeOwner", changeOwner);

// add occupant
router.post("/occupant", check_flat_vacant, addOccupant);

// get occupant
router.get("/occupant/:occupant_id", getOccupant);

// update occupant
router.put("/occupant/:occupant_id", updateOccupant);
// delete / remove occupant
router.delete("/occupant/:occupant_id", deleteOccupant);

// add security guard
router.post("/security", addSecurityGuard);

// get security details
router.get("/security/:id", getSecurity);

// update security
router.put("/security/:id", updateSecurity);

// delete security
router.delete("/security/:id", deleteSecurity);

module.exports = router;
