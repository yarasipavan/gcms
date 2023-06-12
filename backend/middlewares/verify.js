// //import jsonwebtoken
const jwt = require("jsonwebtoken");
// //configure dotenv
require("dotenv").config();
const db = require("../models/index");

exports.verify = (roles) => {
  return (req, res, next) => {
    //lets get the bearerToken from request headers
    let bearerToken = req.headers.authorization;

    // if bearer token in not existed, the user is not authorized
    if (bearerToken === undefined) {
      res.status(401).send({ alertMsg: "You are not authenticated" });
    }
    // else verify
    else {
      //get the token from bearerToken
      let token = bearerToken.split(" ")[1];
      //verify Token
      jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
        if (err) {
          res
            .status(401)
            .send({ alertMsg: "Session Expired please login again..." });
        } else {
          // get the details from the db using user_id
          if (decoded.user.id) {
            let userDetails = await db.Credentials.findByPk(decoded.user.id);
            if (userDetails.status && roles.includes(userDetails.role)) {
              req.user = {
                user_id: userDetails.user_id,
                email: userDetails.username,
              };
              next();
            } else {
              res
                .status(401)
                .send({ alertMsg: "You are not authorized user.." });
            }
          } else {
            res.status(401).send({ alertMsg: "Please login again..." });
          }
        }
      });
    }
  };
};
