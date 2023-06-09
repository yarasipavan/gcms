//  create moni express app / router
const express = require("express");
const router = express.Router();

// import middileware and mudules
const { verifySecurity } = require("../middlewares/verify_security_guard");
const {
  verifySecurityOrAdmin,
} = require("../middlewares/verifySecurityOrAdmin");

// import request handler
const {
  getFlatDetails,
  addVisitorRecord,
  getNotVacatedVisitorsRecords,
  visitorReturned,
  updateVisitorRecord,
  getVisitorsRecordOnParticularTime,
  getAllVisitorsRecord,
} = require("../controllers/security_guard.controller");

// body parser
router.use(express.json());

// routes
router.get("/flat-details", verifySecurity, getFlatDetails);

// add visitor record
router.post("/visitor-record", verifySecurity, addVisitorRecord);

// get the visitors record who are not vacated yet
router.get(
  "/not-vacated-visitors-record",
  verifySecurityOrAdmin,
  getNotVacatedVisitorsRecords
);

//returned time note
router.put("/return/visitor_id/:id", verifySecurity, visitorReturned);

// update visitors records
router.put(
  "/update-visitor-record/visitor_id/:id",
  verifySecurity,
  updateVisitorRecord
);

// get all visitors record
router.get("/visitors-record", verifySecurityOrAdmin, getAllVisitorsRecord);

// get visitor recored on particular time
router.post(
  "/visitors-record-on-time",
  verifySecurityOrAdmin,
  getVisitorsRecordOnParticularTime
);
// export router
module.exports = router;
