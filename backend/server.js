// /create express application
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
// import modules
const adminRoute = require("./routes/admin.routes");
const publicRoute = require("./routes/public.routes");
const occupantRoute = require("./routes/occupant.route");
const securityGuardRoute = require("./routes/security_guard.route");

// import schedules
const billSchedule = require("./schedule/bill.schedule");

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
app.use("/occupant", occupantRoute);
app.use("/security", securityGuardRoute);

// schedule
// ----------------------

// invalid path handler
app.use("*", (req, res, next) => {
  res.send({ pathError: "Invalid path" });
});

// error handler middleware
app.use((err, req, res, next) => {
  res.send({ errMessage: err.messgae });
});
