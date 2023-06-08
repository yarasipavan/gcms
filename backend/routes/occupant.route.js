// create mini express app
const express = require("express");
const router = express.Router();

// body-parser
router.use(express.json());

// import middlewares
const { verifyToken } = require("../middlewares/verifyOccupant");

// import request handlers / constrollers
const {
  getUsingServices,
  addServices,
  stopService,
  getNotUsingServices,
} = require("../controllers/occupant.controller");

// routes

// get using services
router.get("/using-services", verifyToken, getUsingServices);

// get not using services
router.get("/not-using-services", verifyToken, getNotUsingServices);

// add services
router.post("/add-services", verifyToken, addServices);

// stop service
router.delete("/stop-service", verifyToken, stopService);

// export router
module.exports = router;
