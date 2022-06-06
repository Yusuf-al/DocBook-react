const express = require("express");
const { route } = require("express/lib/router");
const doctorCollection = require("./../Modals/doctor-modal");

const router = express.Router();

//Create a new doctor
router.post("/", async (req, res) => {
  const addDoctor = await doctorCollection.create(req.body);
  res.status(200).json({
    success: true,
    data: addDoctor,
  });
});

//get all doctor

router.get("/", async (req, res) => {
  const doctors = await doctorCollection
    .find()
    .populate("userDel")
    .select("-password");
  res.status(200).json(doctors);
});

router.post("/", async (req, res) => {
  const addDoctor = await doctorCollection.create(req.body);
  console.log(addDoctor);
  res.status(200).json({ success: true, addDoctor });
});

router.get("/:slug", async (req, res) => {
  const doctor = await doctorCollection
    .findOne({ slug: req.params.slug })
    .populate("myAppoinments chambers userDel");
  res.status(200).json(doctor);
});

module.exports = router;
