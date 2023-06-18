//  create mini express application
const express = require("express");
const router = express.Router();

// middlewares
const { verify } = require("../middlewares/verify");

const {
  loginJoi,
  changePasswordJoi,
  forgotPasswordLinkJoi,
  resetPasswordJoi,
} = require("../middlewares/public_route.joi");

// request handlers
const {
  login,
  changePassword,
  forgotPasswordLink,
  resetPassword,
} = require("../controllers/public.controllers");

// body-parser
router.use(express.json());

router.post("/login", loginJoi, login);

// change password
router.post(
  "/change-password",
  verify(["security", "admin", "occupant"]),
  changePasswordJoi,
  changePassword
);

// forgot password link
router.post("/forgot-password", forgotPasswordLinkJoi, forgotPasswordLink);

// reset password
router.post("/reset-password", resetPasswordJoi, resetPassword);
// export router
module.exports = router;
