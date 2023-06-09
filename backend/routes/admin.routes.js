// create mini express app
const express = require("express");
const router = express.Router();

// import middlewares
const check_flat_vacant = require("../middlewares/check_flat_vacant");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

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
  getBill,
  updateServiceCosts,
  // sendMail,
} = require("../controllers/admin.controllers");

// routes

// get flat details
router.get("/flats-details", verifyAdmin, getFlatsDetails);

// get vacant flats
router.get("/vacant-flats", verifyAdmin, getVacantFlats);

// add flat
router.post("/flat", verifyAdmin, addFlat);

// update flat
router.put(
  "/flat/block/:block/flat_number/:flat_number",
  verifyAdmin,
  updateFlat
);

// delete flat
router.delete(
  "/flat/block/:block/flat_number/:flat_number",
  verifyAdmin,
  deleteFlat
);

// get owner
router.get("/owner/owner_id/:owner_id", verifyAdmin, getOwner);

// add owner
router.post("/owner", verifyAdmin, addOwner);

// update change owner
router.put("/owner/owner_id/:owner_id", verifyAdmin, updateOwner);

// delete owner
router.delete("/owner/owner_id/:owner_id", verifyAdmin, deleteOwner);

// change owner
router.put("/changeOwner", verifyAdmin, changeOwner);

// add occupant
router.post("/occupant", verifyAdmin, check_flat_vacant, addOccupant);

// get occupant
router.get("/occupant/:occupant_id", verifyAdmin, getOccupant);

// update occupant
router.put("/occupant/:occupant_id", verifyAdmin, updateOccupant);
// delete / remove occupant
router.delete("/occupant/:occupant_id", verifyAdmin, deleteOccupant);

// add security guard
router.post("/security", verifyAdmin, addSecurityGuard);

// get security details
router.get("/security/:id", verifyAdmin, getSecurity);

// update security
router.put("/security/:id", verifyAdmin, updateSecurity);

// delete security
router.delete("/security/:id", verifyAdmin, deleteSecurity);

// update service costs
router.put("/update-service-costs", verifyAdmin, updateServiceCosts);

// get bill
router.get(
  "/bill/occupant/:occupant_id/year/:year/month/:month",
  verifyAdmin,
  getBill
);

module.exports = router;
