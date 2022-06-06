const express = require("express");
const chamberCollection = require("./../Modals/chamber-modal");
const verifyToken = require("./../utils/VerifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  const chambers = await chamberCollection.find();
  res.status(200).json(chambers);
});

router.post("/", async (req, res) => {
  const addChamber = await chamberCollection.create(req.body);
  res.status(200).json({ success: true, data: addChamber });
});
router.delete("/:id", async (req, res) => {
  const remainChamber = await chamberCollection.findByIdAndDelete(
    req.params.id
  );
  res.status(200).json({ success: true, message: "Item deleted" });
});

module.exports = router;
