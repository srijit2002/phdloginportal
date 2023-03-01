const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  sizeInBytes: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);
// User.createIndexes();
module.exports = File;