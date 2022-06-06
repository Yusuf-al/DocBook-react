const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: [true, "This email already used"],
      validate: [validator.isEmail],
    },
    password: {
      type: String,
      minlength: [6, "Password length should be more than 6 character !"],
      // select: false,
    },
    confirmPass: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password does not match !",
      },
    },
    role: {
      type: String,
      enum: ["doctor", "gen-user"],
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("userInfo", {
  ref: "DoctorsList",
  foreignField: "userDel",
  localField: "_id",
});
userSchema.virtual("patientInfo", {
  ref: "PatientsList",
  foreignField: "userDel",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPass = undefined;
  next();
});

userSchema.methods.comparePass = async function (givenPass, savePass) {
  return await bcrypt.compare(givenPass, savePass);
};

const auth = mongoose.model("AuthList", userSchema);

module.exports = auth;
