const express = require("express");
const authCollection = require("./../Modals/auth-modal");
const tokenColl = require("./../Modals/token-modal");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");

//Send Email for verification
const sendEmail = async (userEmail, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "docbookofficial2022@gmail.com",
        pass: "DocBook@2022",
      },
    });

    await transporter.sendMail({
      from: "docbookofficial2022@gmail.com",
      to: userEmail,
      subject: "Email Verification",
      html: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};

//Verify Token

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;

    next();
  });
}

router.get("/", verifyJWT, async (req, res) => {
  const id = req.decoded.id;
  const authData = await authCollection
    .findOne({ _id: id })
    .populate({ path: "userInfo", populate: "myAppoinments chambers" })
    .populate({ path: "patientInfo", populate: "myAppoinments" });
  res.json(authData);
});

router.post("/", async (req, res) => {
  try {
    const user = await authCollection.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already exits" });
    } else {
      const addAuth = await authCollection.create(req.body);

      const token = await new tokenColl({
        userId: addAuth._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const text = `<p>Welcome to DocBook world <br> User Security is priority <br> So Please Click the link below to verify your email <br>
      <h3><a href="http://localhost:3000/${addAuth._id}/veryfi/${token.token}">Please Click here to verify</a></h3>
      </p>`;

      if (addAuth) {
        await sendEmail(req.body.email, text);
        return res.status(200).json({ success: true, addAuth });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await authCollection.findOne({ email });

  if (
    !checkUser ||
    !(await checkUser.comparePass(password, checkUser.password))
  ) {
    return res.status(400).send({ message: "User not found", success: false });
  }

  const jwtToken = jwt.sign(
    { id: checkUser._id, role: checkUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({ user: checkUser, token: jwtToken });
});

router.get("/:id/veryfi/:token", async (req, res) => {
  const userId = req.params.id;
  const token = req.params.token;

  const user = await authCollection.findById(userId);

  const verifyToken = await tokenColl.findOne({ token: token });
  if (!user || !verifyToken) {
    return res.status(400).json({ success: true, message: "Invalid Link" });
  }

  await authCollection.updateOne(
    { _id: userId },
    {
      $set: {
        isVarified: true,
      },
    }
  );
  await tokenColl.findByIdAndDelete(verifyToken._id);
  res.status(200).json({ message: "Success" });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = await authCollection.updateOne(
    { _id: id },
    {
      $set: {
        isCompleted: true,
      },
    }
  );
  res.status(200).json({ message: "Success", updateData });
});
module.exports = router;
