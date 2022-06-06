const express = require("express");

const gnUnserCollection = require("./../Modals/gnUser-modal");

const router = express.Router();

//Create a user
router.post("/", async (req, res) => {
  const addGnUser = await gnUnserCollection.create(req.body);
  res.status(200).json({ success: true, addGnUser });
});

//get All user
router.get("/", async (req, res) => {
  const genUsers = await gnUnserCollection.find();
  res.status(200).json(genUsers);
});

//get a single user
router.get("/:id", async (req, res) => {
  const genUser = await gnUnserCollection
    .findById(req.params.id)
    .populate({ path: "myAppoinments", populate: "doctorData" });
  res.status(200).json(genUser);
});

module.exports = router;
