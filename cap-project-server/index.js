const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const docRoute = require("./Routes/doctor-route");
const gnUserRoute = require("./Routes/gnUser-route");
const appoinmentRoute = require("./Routes/appointments-route");
const chamberRoute = require("./Routes/chamber-route");
const authRoute = require("./Routes/auth");
const port = process.env.PORT || 5080;

//Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dq9n3.mongodb.net/Capstone-ReactDB`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true,
    }
  )
  .then(() => console.log("Connect established with MongoDB"));

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.use("/api/v1/doctor", docRoute);
app.use("/api/v1/gen-user", gnUserRoute);
app.use("/api/v1/appointment", appoinmentRoute);
app.use("/api/v1/chamber", chamberRoute);
app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  console.log(`Capstone Project server listening on port ${port}`);
});
