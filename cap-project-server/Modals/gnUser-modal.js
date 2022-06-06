const mongoose = require("mongoose");
const validator = require("validator");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userDel: {
      type: mongoose.Schema.ObjectId,
      ref: "AuthList",
    },
    phoneNum: {
      type: Number,
    },
    dob: {
      type: String,
      //required: true,
    },
    address: {
      type: String,
      //required: true,
    },
    healthIssu: {
      type: String,
      //required: true,
    },
    gender: {
      type: String,
    },
    userPhoto: {
      type: String,
      default: null,
    },
    userPdf: {
      type: String,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

patientSchema.virtual("myAppoinments", {
  ref: "AppointmentsList",
  foreignField: "patientData",
  localField: "_id",
});

const patients = mongoose.model("PatientsList", patientSchema);

module.exports = patients;
