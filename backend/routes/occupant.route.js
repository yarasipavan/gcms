// create mini express app
const express = require("express");
const router = express.Router();

// body-parser
router.use(express.json());

// import middlewares
const { verifyOccupant } = require("../middlewares/verifyOccupant");
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
} = require("../controllers/occupant.controller");

// routes

// get using services
router.get("/using-services", verifyOccupant, getUsingServices);

// get not using services
router.get("/not-using-services", verifyOccupant, getNotUsingServices);

// add services
router.post("/add-services", addServicesJoi, verifyOccupant, addServices);

// stop service
router.put("/stop-service", deleteServiceJoi, verifyOccupant, stopService);

// update profile
router.put("/profile", updateProfileJoi, verifyOccupant, updateProfile);

// get profile
router.get("/profile", verifyOccupant, getProfile);

// get bill
router.get("/bill/year/:year/month/:month", verifyOccupant, getBill);

// export router
module.exports = router;
