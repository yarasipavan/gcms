//  create mini express application
const express = require("express");
const router = express.Router();

const { login } = require("../controllers/public.controllers");

// body-parser
router.use(express.json());

router.post("/login", login);

// export router
module.exports = router;
