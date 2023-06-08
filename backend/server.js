// /create express application
const express = require("express");
const app = express();

// import modules
const adminRoute = require("./routes/admin.routes");
const publicRoute = require("./routes/public.routes");

//  configure dotenv
require("dotenv").config();

// make express application to listen the client request
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log("Server running at port no.: -", port);
});

// APIs
app.use("/", publicRoute);
app.use("/admin", adminRoute);

// error handler middleware
app.use((err, req, res, next) => {
  res.send({ errMessage: err.messgae });
});

// invalid path handler
app.use("*", (req, res, next) => {
  res.send({ pathError: "Invalid path" });
});
