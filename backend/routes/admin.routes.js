// create mini express app
const express = require("express");
const router = express.Router();

// import middlewares
const check_flat_vacant = require("../middlewares/check_flat_vacant");
const { verify } = require("../middlewares/verify");
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
  dashboard,
  getMonthlyBillSum,
  getServices,
} = require("../controllers/admin.controllers");

// routes

// get flat details
router.get("/flats-details", verify(["admin"]), getFlatsDetails);

// get vacant flats
router.get("/vacant-flats", verify(["admin"]), getVacantFlats);

// add flat
router.post("/flat", verify(["admin"]), addFlatMiddleware, addFlat);

// update flat
router.put(
  "/flat/block/:block/flat_number/:flat_number",
  verify(["admin"]),
  addFlatMiddleware,
  updateFlat
);

// get owner
router.get("/owner/owner_id/:owner_id", verify(["admin"]), getOwner);

router.get("/owners", verify(["admin"]), getAllOwners);

// add owner
router.post("/owner", verify(["admin"]), addOwnerMiddleware, addOwner);

// update change owner
router.put(
  "/owner/owner_id/:owner_id",
  verify(["admin"]),
  updateOwnerDetailsMiddleware,

  updateOwner
);

// change owner
router.put("/changeOwner", verify(["admin"]), changeOwnerJoi, changeOwner);

// add occupant
router.post(
  "/occupant",
  verify(["admin"]),
  addOccupantJoi,

  check_flat_vacant,
  addOccupant
);

// get occupant
router.get("/occupant/:occupant_id", verify(["admin"]), getOccupant);

// get All occupants
router.get("/occupants", verify(["admin"]), getAllOccupants);

// get overall occupants
router.get("/overall-occupants", verify(["admin"]), getOverallOccupants);

// update occupant
router.put(
  "/occupant/:occupant_id",
  verify(["admin"]),
  updateOccupantJoi,
  updateOccupant
);
// delete / remove occupant
router.delete(
  "/occupant/:occupant_id",
  verify(["admin"]),
  removeOccupantJoi,
  deleteOccupant
);

// add security guard
router.post(
  "/security",
  verify(["admin"]),
  addSecurityGuardJoi,
  addSecurityGuard
);

// get security details
router.get("/security/:id", verify(["admin"]), getSecurity);

// get all security
router.get("/all-security", verify(["admin"]), getAllSecurity);

// update security
router.put(
  "/security/:id",
  verify(["admin"]),
  updateSecurityGuardJoi,
  updateSecurity
);

// delete security
router.delete(
  "/security/:id",
  verify(["admin"]),
  deleteSecurityGuardJoi,
  deleteSecurity
);

// update service costs
router.put(
  "/update-service-costs",
  verify(["admin"]),
  updateServiceChargesJoi,
  updateServiceCosts
);

// get bill
router.get(
  "/bill/occupant/:occupant_id/year/:year/month/:month",
  verify(["admin"]),
  getBillJoi,
  getBill
);

// send mail to all occupants
router.post(
  "/mail-to-occupants",
  verify(["admin"]),
  sendMailsJoi,
  sendMailToOccupants
);

// get services
router.get("/services", verify(["admin"]), getServices);

//get billdata
router.get("/billData", verify(["admin"]), getMonthlyBillSum);

router.get("/dashboard", verify(["admin"]), dashboard);
module.exports = router;
