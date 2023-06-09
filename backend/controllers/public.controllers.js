const db = require("../models/index");
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// config dotenv
require("dotenv").config();
const { transporter } = require("../custom_modules/transporter");

exports.login = expressAsyncHandler(async (req, res) => {
  let { username, password } = req.body;
  // check user exist or not
  let user = await db.Credentials.findOne({
    where: { username: username },
    order: [["user_id", "desc"]],
  });

  if (user) {
    // check status
    if (!user.status) {
      res.status(403).send({
        alertMsg: "Your account is deactivated... please contact admin",
      });
    } else {
      // check password Is correct

      if (await bcryptjs.compare(password, user.password)) {
        // generate jwt

        delete user.password;
        let token = jwt.sign({ user: user }, process.env.TOKEN_SECRET_KEY, {
          expiresIn: "7d",
        });

        res
          .status(200)
          .send({ message: "Login Successfull", token: token, payload: user });
      } else {
        res.status(401).send({ alertMsg: "Invalid Password" });
      }
    }
  } else {
    res.status(401).send({ alertMsg: "Invalid Username" });
  }
});

// change password
exports.changePassword = expressAsyncHandler(async (req, res) => {
  // get old_password and new password
  let { old_password, new_password } = req.body;
  new_password = new_password.trim();

  // get user credentails details
  let credentials = await db.Credentials.findOne({
    where: { user_id: req.user.user_id },
  });

  // check the old password is correct
  if (await bcryptjs.compare(old_password, credentials["password"])) {
    // check old password and new password is same
    if (old_password === new_password) {
      res
        .status(400)
        .send({ alertMsg: "old password and new password must be different" });
    }
    // check the new password length
    else if (new_password.length < 8) {
      res
        .status(400)
        .send({ alertMsg: "password must be contain alleast 8 characters" });
    } else {
      // update /change the password by hashing
      let hashedPassword = await bcryptjs.hash(new_password, 5);
      let [updates] = await db.Credentials.update(
        { password: hashedPassword },
        { where: { user_id: req.user.user_id, role: req.user.role } }
      );
      if (updates) {
        res.status(200).send({ message: "Password changed successfully" });
      } else {
        res
          .status(500)
          .send({ alertMsg: "Something went wrong... please try again" });
      }
    }
  }
  // if old password is in correct
  else {
    res.status(400).send({ alertMsg: "Invalid old password" });
  }
});

// forgot password
exports.forgotPasswordLink = expressAsyncHandler(async (req, res) => {
  //check the user existed with requested email
  let user = await db.Credentials.findOne({
    where: { username: req.body.username },
    order: [["id", "desc"]],
    status: true,
  });

  //if user exist the send the password reset link to email
  if (user) {
    //generate  token
    let reset_token = jwt.sign(
      { username: req.body.username },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: 600 } //10 min
    );

    // store reset_token in db
    let [updates] = await db.Credentials.update(
      { reset_token: reset_token },
      { where: { id: user.id } }
    );
    if (updates) {
      //send mail
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${user.reset_token}`;
      const mailOptions = {
        from: "Admin",
        to: req.body.username,
        subject: "Password Reset Request|Gated Community Management System",
        html: `<h2>Click the link below to reset your password:</h2>\n\n${resetLink}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error sending reset email");
        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).status(200).send({
            message:
              "Reset link is sent to your mail. The Link will expires in 10 mins",
            token: user.reset_token,
          });
        }
      });
    } else {
      res.status(500).send({ alertMsg: "something went wrong... " });
    }
  } else {
    res.status(200).send({
      alertMsg:
        "This Email is not found. Your account may be removed or invalid email address",
    });
  }
});

//reset password
exports.resetPassword = expressAsyncHandler(async (req, res) => {
  //get the token and new password
  //if token valid update user password
  let { token, password } = req.body;

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
    console.log(decoded);
    if (err) {
      res.status(404).send({ alertMsg: "Invalid link or link expired" });
    } else {
      //hash the password
      let hashedpwd = await bcryptjs.hash(password, 5);
      await db.Credentials.update(
        { password: hashedpwd },
        { where: { username: decoded.username } }
      );
      res.status(200).send({ message: "password Updated Successfully" });
    }
  });
});
