const mongoose = require("mongoose");

const appoinmentSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      //   required: true,
    },
    address: {
      type: String,
    },
    contactNo: {
      type: Number,
    },
    patientName: {
      type: String,
    },
    patientData: {
      type: mongoose.Schema.ObjectId,
      ref: "PatientsList",
      // required:true
    },
    healthIssu: {
      type: String,
    },
    doctorData: {
      type: mongoose.Schema.ObjectId,
      ref: "DoctorsList",
      // required:true
    },
    chamberData: {
      type: mongoose.Schema.ObjectId,
      ref: "ChamberList",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

appoinmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "chamberData",
  });
  next();
});
appoinmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctorData",
  });
  next();
});

const appointments = mongoose.model("AppointmentsList", appoinmentSchema);

module.exports = appointments;
