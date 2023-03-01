const mongoose = require("mongoose");
const { Schema } = mongoose;
const AdminSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// mongoose.model = {};
const Admin = mongoose.model("admin", AdminSchema);
// User.createIndexes();
module.exports = Admin;
