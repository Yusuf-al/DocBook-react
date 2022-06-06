const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //   required: [true, "Enter your name"],
    },
    userDel: {
      type: mongoose.Schema.ObjectId,
      ref: "AuthList",
    },
    phoneNum: {
      type: Number,
      //required: [true, "Enter Phone Number"],
    },
    dob: {
      type: String,
      //required: [true, "Enter Date"],
    },
    gander: {
      type: String,
      enum: ["Male", "Female", "Others"],
      //required: [true, "Gender is required"],
    },

    address: {
      type: String,
      //required: [true, "Enter Address"],
    },

    schoolInfo: [{ type: String }],

    collegeInfo: [{ type: String }],

    mbbsInfo: [{ type: String }],

    otherDegInfo: [{ type: String }],

    extraQuility: {
      type: String,
    },

    workdPlace: {
      type: String,
      // required: [true, "Enter Position"],
    },
    currentPosition: {
      type: String,
      // required: [true, "Enter Position"],
    },
    pastHistory: {
      type: String,
      //required: [true, "Enter Position"],
    },
    tobTitle: {
      type: String,
      //required: [true, "Enter Jon title"],
    },
    exprience: {
      type: Number,
      // required: [true, "Enter Position"],
    },
    profileImg: {
      type: String,
    },

    specialties: [{ type: String }],

    socialMedia: { type: String },

    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.virtual("myAppoinments", {
  ref: "AppointmentsList",
  foreignField: "doctorData",
  localField: "_id",
});

doctorSchema.virtual("chambers", {
  ref: "ChamberList",
  foreignField: "doctorData",
  localField: "_id",
});

doctorSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const doctors = mongoose.model("DoctorsList", doctorSchema);

module.exports = doctors;
