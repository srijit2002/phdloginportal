const mongoose = require("mongoose");
const { Schema } = mongoose;
const HeadSchema = new Schema({
  full_name: {
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
const Head = mongoose.model("head", HeadSchema);
// User.createIndexes();
module.exports = Head;
