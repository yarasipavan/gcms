//  create mini express application
const express = require("express");
const router = express.Router();
const db = require("../models/index");

// body-parser
router.use(express.json());

// export router
module.exports = router;
