//  create mini express application
const express = require("express");
const router = express.Router();

// middlewares
const {
  verifySecurityOccupantAdmin,
} = require("../middlewares/verifySecurityOccupantAdmin");

// request handlers
const {
  login,
  changePassword,
  forgotPasswordLink,
  resetPassword,
} = require("../controllers/public.controllers");

// body-parser
router.use(express.json());

router.post("/login", login);

// change password
router.post("/change-password", verifySecurityOccupantAdmin, changePassword);

// forgot password link
router.post("/forgot-password", forgotPasswordLink);

// reset password
router.post("/reset-password", resetPassword);
// export router
module.exports = router;
