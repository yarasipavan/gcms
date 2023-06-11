// create mini express app
const express = require("express");
const router = express.Router();

// import middlewares
const check_flat_vacant = require("../middlewares/check_flat_vacant");
const { verifyAdmin } = require("../middlewares/verifyAdmin");
const {
  addFlatMiddleware,
  addOwnerMiddleware,
  updateOwnerDetailsMiddleware,
  changeOwnerJoi,
  addOccupantJoi,
  updateOccupantJoi,
  removeOccupantJoi,
  addSecurityGuardJoi,
  updateSecurityGuardJoi,
  deleteSecurityGuardJoi,
  updateServiceChargesJoi,
  getBillJoi,
  sendMailsJoi,
} = require("../middlewares/admin.joi");

// body parser
router.use(express.json());

// import controllers
const {
  getFlatsDetails,
  addFlat,
  updateFlat,
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
} = require("../controllers/admin.controllers");

// routes

// get flat details
router.get("/flats-details", verifyAdmin, getFlatsDetails);

// get vacant flats
router.get("/vacant-flats", verifyAdmin, getVacantFlats);

// add flat
router.post("/flat", verifyAdmin, addFlatMiddleware, addFlat);

// update flat
router.put(
  "/flat/block/:block/flat_number/:flat_number",
  addFlatMiddleware,
  verifyAdmin,
  updateFlat
);

// get owner
router.get("/owner/owner_id/:owner_id", verifyAdmin, getOwner);

router.get("/owners", verifyAdmin, getAllOwners);

// add owner
router.post("/owner", verifyAdmin, addOwnerMiddleware, addOwner);

// update change owner
router.put(
  "/owner/owner_id/:owner_id",
  updateOwnerDetailsMiddleware,
  verifyAdmin,
  updateOwner
);

// change owner
router.put("/changeOwner", changeOwnerJoi, verifyAdmin, changeOwner);

// add occupant
router.post(
  "/occupant",
  addOccupantJoi,
  verifyAdmin,
  check_flat_vacant,
  addOccupant
);

// get occupant
router.get("/occupant/:occupant_id", verifyAdmin, getOccupant);

// get All occupants
router.get("/occupants", verifyAdmin, getAllOccupants);

// get overall occupants
router.get("/overall-occupants", verifyAdmin, getOverallOccupants);

// update occupant
router.put(
  "/occupant/:occupant_id",
  updateOccupantJoi,
  verifyAdmin,
  updateOccupant
);
// delete / remove occupant
router.delete(
  "/occupant/:occupant_id",
  removeOccupantJoi,
  verifyAdmin,
  deleteOccupant
);

// add security guard
router.post("/security", addSecurityGuardJoi, verifyAdmin, addSecurityGuard);

// get security details
router.get("/security/:id", verifyAdmin, getSecurity);

// get all security
router.get("/all-security", verifyAdmin, getAllSecurity);

// update security
router.put(
  "/security/:id",
  updateSecurityGuardJoi,
  verifyAdmin,
  updateSecurity
);

// delete security
router.delete(
  "/security/:id",
  deleteSecurityGuardJoi,
  verifyAdmin,
  deleteSecurity
);

// update service costs
router.put(
  "/update-service-costs",
  updateServiceChargesJoi,
  verifyAdmin,
  updateServiceCosts
);

// get bill
router.get(
  "/bill/occupant/:occupant_id/year/:year/month/:month",
  getBillJoi,
  verifyAdmin,
  getBill
);

// send mail to all occupants
router.post(
  "/mail-to-occupants",
  sendMailsJoi,
  verifyAdmin,
  sendMailToOccupants
);
module.exports = router;
