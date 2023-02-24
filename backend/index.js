const connectToMongo = require("./db");
const express = require("express");
// const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
var cors = require("cors");
connectToMongo();
var app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));


app.listen(port, () => {
  // console.log(process.env.EMAIL_HOST);
  console.log(`Example app listening at http://localhost:${port}`);
});
