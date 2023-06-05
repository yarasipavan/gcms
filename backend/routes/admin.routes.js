// create mini express app
const express = require("express");
const router = express.Router();

// body parser
router.use(express.json());

// import controllers
const {
  getFlatsDetails,
  addFlat,
  updateFlat,
  deleteFlat,
} = require("../controllers/admin.controllers");

// routes

// get flat details
router.get("/flats-details", getFlatsDetails);

// add flat
router.post("/flat", addFlat);

// update flat
router.put("/flat/block/:block/flat_number/:flat_number", updateFlat);

// delete flat
router.delete("/flat/block/:block/flat_number/:flat_number", deleteFlat);

// get owner
// add owner
// update change owner
// delete owner

module.exports = router;
