//import jsonwebtoken
const jwt = require("jsonwebtoken");
//configure dotenv
require("dotenv").config();

//funtion to verify the token and pass the flow
exports.verifyToken = (req, res, next) => {
  //lets get the bearerToken from request headers
  let bearerToken = req.headers.authorization;
  // if bearer token in not existed, the user is not authorized
  if (bearerToken === undefined) {
    res.status(401).send({ alertMsg: "You are not authenticated" });
  }
  //else verify the token
  else {
    //get the token from bearerToken
    let token = bearerToken.split(" ")[1];
    //verify Token
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .send({ alertMsg: "Session Expired please login again..." });
      } else {
        if (decoded.user.role == "occupant" && decoded.user.status) {
          req.user = {
            user_id: decoded.user.user_id,
            email: decoded.user.username,
          };
          next();
        } else {
          res.status(401).send({ alertMsg: "You are not authorized user.." });
        }
      }
    });
  }
};
