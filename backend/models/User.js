const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  web_mail: {
    type: String,
    required: true,
    unique: true,
  },
  rollno: {
    type: String,
    required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  alt_mail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // After Login Details
  Guide: {
    type: String,
    default: "Not Set",
  },
  Co_Guide: {
    type: String,
    default: "Not Set",
  },
  Commencement_Date: {
    type: Date,
    default: "08/06/2008",
  },
  PDF_DownloadLink: {
    type: String,
    default: "Not Set",
  },
});
// mongoose.model = {};
const User = mongoose.model("user", UserSchema);
// User.createIndexes();
module.exports = User;
