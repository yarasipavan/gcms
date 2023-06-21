// /create express application
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
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

//merge fontend with backend
app.use(express.static(path.join(__dirname, "../frontend/build")));

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

//page refresh handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
// invalid path handler
app.use("*", (req, res, next) => {
  res.send({ pathError: "Invalid path" });
});

// error handler middleware
app.use((err, req, res, next) => {
  res.send({ errMessage: err.messgae });
});
