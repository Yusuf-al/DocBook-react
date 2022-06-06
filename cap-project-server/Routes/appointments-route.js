const express = require("express");
const appointmentCollection = require("./../Modals/appointment-modal");
const { route } = require("./doctor-route");

const router = express.Router();

router.post("/book-appointment", async (req, res) => {
  const bookAppointment = await appointmentCollection.create(req.body);
  res.status(200).json(bookAppointment);
});

router.delete("/:id", async (req, res) => {
  const cancelAppoint = await appointmentCollection.findByIdAndDelete(
    req.params.id
  );
  res.status(200).json({ success: true });
});

module.exports = router;
