// create mini express app
const express = require("express");
const router = express.Router();

// body-parser
router.use(express.json());

// import middlewares
const { verify } = require("../middlewares/verify");
const {
  addServicesJoi,
  deleteServiceJoi,
  updateProfileJoi,
} = require("../middlewares/occupant.joi");

// import request handlers / constrollers
const {
  getUsingServices,
  addServices,
  stopService,
  getNotUsingServices,
  updateProfile,
  getProfile,
  getBill,
  createPaymentSession,
  successfullPayment,
} = require("../controllers/occupant.controller");

// routes

// get using services
router.get("/using-services", verify(["occupant"]), getUsingServices);

// get not using services
router.get("/not-using-services", verify(["occupant"]), getNotUsingServices);

// add services
router.post("/add-services", verify(["occupant"]), addServicesJoi, addServices);

// stop service
router.put(
  "/stop-service",
  verify(["occupant"]),
  deleteServiceJoi,
  stopService
);

// update profile
router.put("/profile", verify(["occupant"]), updateProfileJoi, updateProfile);

// get profile
router.get("/profile", verify(["occupant"]), getProfile);

// get bill
router.get("/bill/year/:year/month/:month", verify(["occupant"]), getBill);

// pay link
router.get("/paylink/:bill_id", verify(["occupant"]), createPaymentSession);
router.get("/successfullpayment/:session_id", successfullPayment);

// export router
module.exports = router;
