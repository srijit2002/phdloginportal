const connectToMongo = require("./db");
const express = require("express");
const Department = require("./models/Department");
// const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
var cors = require("cors");
const Admin = require("./models/Admin");
const cloudinary = require("cloudinary").v2;

connectToMongo();

cloudinary.config({
  cloud_name: "drxdqo1xr",
  api_key: "264938527261548",
  api_secret: "_p_Ry226TikW-TTJHuX9wSU_zEQ",
});

var app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/adminauth", require("./routes/adminauth"));
app.use("/api/headauth", require("./routes/headauth"));
app.use("/api/depauth", require("./routes/depauth"));

app.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find({}, { department: 1 });
    res.json(departments);
  } catch (err) {
    console.log("Error fetching departments", err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

app.get("/getFac/:dept", async (req, res) => {
  try {
    let department = req.params.dept;
    const faculties = await Admin.find({ department: department }).select("-password");
    res.json(faculties);
  } catch (err) {
    console.log("Error Fetching Faculties", err);
    res.status(500).json({ error: "Failed to fetch faculties" });
  }
});

app.listen(port, () => {
  // console.log(process.env.EMAIL_HOST);
  console.log(`Example app listening at http://localhost:${port}`);
});
