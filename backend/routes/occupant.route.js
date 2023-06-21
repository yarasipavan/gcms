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
  getProfile,
  getBill,
  createPaymentSession,
  successfullPayment,
} = require("../controllers/occupant.controller");

// import handlers
const {
  getUsingServicesHandler,
  getNotUsingServicesHandler,
  addServicesHandler,
  updateProfileHandler,
  stopServiceHandler,
  getProfileHandler,
  getBillHandler,
  createPaymentSessionHandler,
  successfullPaymentHandler,
} = require("./occupant_handler");

// routes

// get using services
router.get("/using-services", verify(["occupant"]), getUsingServicesHandler);

// get not using services
router.get(
  "/not-using-services",
  verify(["occupant"]),
  getNotUsingServicesHandler
);

// add services
router.post(
  "/add-services",
  verify(["occupant"]),
  addServicesJoi,
  addServicesHandler
);

// stop service
router.put(
  "/stop-service",
  verify(["occupant"]),
  deleteServiceJoi,
  stopServiceHandler
);

// update profile
router.put(
  "/profile",
  verify(["occupant"]),
  updateProfileJoi,
  updateProfileHandler
);

// get profile
router.get("/profile", verify(["occupant"]), getProfileHandler);

// get bill
router.get(
  "/bill/year/:year/month/:month",
  verify(["occupant"]),
  getBillHandler
);

// pay link
router.get(
  "/paylink/:bill_id",
  verify(["occupant"]),
  createPaymentSessionHandler
);
router.get("/successfullpayment/:session_id", successfullPayment);

// export router
module.exports = router;
