const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  phoneNo: { type: Number, required: true },
  emailId: { type: String, required: true },
  address: { type: String },
  companyName: { type: String },
  cin: { type: String },
  pan: { type: String },
  gstNo: { type: String },
  panFile: { type: Buffer },
  cinFile: { type: Buffer },
});

let userModel;
if (mongoose.models.users) {
  userModel = mongoose.model("users");
}
userModel = mongoose.model("users", userSchema);

module.exports = userModel;
