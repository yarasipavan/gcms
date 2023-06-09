// create mini express app
const express = require("express");
const router = express.Router();

// import middlewares
const check_flat_vacant = require("../middlewares/check_flat_vacant");
const { verifyToken } = require("../middlewares/verifyAdmin");

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
router.get("/flats-details", verifyToken, getFlatsDetails);

// get vacant flats
router.get("/vacant-flats", verifyToken, getVacantFlats);

// add flat
router.post("/flat", verifyToken, addFlat);

// update flat
router.put(
  "/flat/block/:block/flat_number/:flat_number",
  verifyToken,
  updateFlat
);

// delete flat
router.delete(
  "/flat/block/:block/flat_number/:flat_number",
  verifyToken,
  deleteFlat
);

// get owner
router.get("/owner/owner_id/:owner_id", verifyToken, getOwner);

// add owner
router.post("/owner", verifyToken, addOwner);

// update change owner
router.put("/owner/owner_id/:owner_id", verifyToken, updateOwner);

// delete owner
router.delete("/owner/owner_id/:owner_id", verifyToken, deleteOwner);

// change owner
router.put("/changeOwner", verifyToken, changeOwner);

// add occupant
router.post("/occupant", verifyToken, check_flat_vacant, addOccupant);

// get occupant
router.get("/occupant/:occupant_id", verifyToken, getOccupant);

// update occupant
router.put("/occupant/:occupant_id", verifyToken, updateOccupant);
// delete / remove occupant
router.delete("/occupant/:occupant_id", verifyToken, deleteOccupant);

// add security guard
router.post("/security", verifyToken, addSecurityGuard);

// get security details
router.get("/security/:id", verifyToken, getSecurity);

// update security
router.put("/security/:id", verifyToken, updateSecurity);

// delete security
router.delete("/security/:id", verifyToken, deleteSecurity);

module.exports = router;
