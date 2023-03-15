const mongoose = require("mongoose");
const { Schema } = mongoose;
const DepartmentSchema = new Schema({
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// mongoose.model = {};
const Departmaent = mongoose.model("department", DepartmentSchema);
// User.createIndexes();
module.exports = Departmaent;
