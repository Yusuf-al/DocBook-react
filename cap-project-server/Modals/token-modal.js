const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "AuthList",
    unique: true,
  },
  token: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const secretToken = mongoose.model("tokenData", tokenSchema);
module.exports = secretToken;
