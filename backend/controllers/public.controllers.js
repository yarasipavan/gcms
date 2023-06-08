const db = require("../models/index");
const expressAsyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// config dotenv
require("dotenv").config();

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

        res.send({ message: "Login Successfull", token: token, payload: user });
      } else {
        res.status(401).send({ alertMsg: "Invalid Password" });
      }
    }
  } else {
    res.status(401).send({ alertMsg: "Invalid Username" });
  }
});
