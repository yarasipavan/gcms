// import controllers
const {
  getUsingServices,
  addServices,
  stopService,
  getNotUsingServices,
  updateProfile,
  getProfile,
  getBill,
  createPaymentSession,
  successfullPayment,
} = require("../controllers/occupant.controller");

exports.getUsingServicesHandler = async (req, res) => {
  try {
    let services = await getUsingServices(req);
    res.status(200).send(services);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.getNotUsingServicesHandler = async (req, res) => {
  try {
    let services = await getNotUsingServices(req);
    res.status(200).send(services);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.addServicesHandler = async (req, res) => {
  try {
    let updatedDetails = await addServices(req.user, req.body);
    res.status(201).json(updatedDetails);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.updateProfileHandler = async (req, res) => {
  try {
    let updatedProfile = await updateProfile(req.user, req.body);
    res.send(updatedProfile);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.stopServiceHandler = async (req, res) => {
  try {
    let updated = await stopService(req.user, req.body);
    updated ? res.send("stopped") : res.send("not stopped");
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.getProfileHandler = async (req, res) => {
  try {
    let occupant = await getProfile(req.user);
    if (occupant) res.send(occupant);
    else res.status(400).send("occupant details not found");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getBillHandler = async (req, res) => {
  try {
    let billRecord = await getBill(req.user, req.params);
    if (billRecord) {
      res.send(billRecord);
    } else res.status(404).send({ alertMsg: "No biiling found" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.createPaymentSessionHandler = async (req, res) => {
  try {
    let url = await createPaymentSession(req.params);
    res.send(url);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.successfullPaymentHandler = async (req, res) => {
  try {
    let paid = await successfullPayment(req.params);
    paid
      ? res.send({ message: "Paid" })
      : res.status(500).send({ alertMsg: "som ething went wrong" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
