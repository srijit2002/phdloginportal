const connectToMongo = require("./db");
const express = require("express");
// const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
var cors = require("cors");
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

app.listen(port, () => {
  // console.log(process.env.EMAIL_HOST);
  console.log(`Example app listening at http://localhost:${port}`);
});
