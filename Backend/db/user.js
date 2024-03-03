const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
});
const usermodel = mongoose.model("users", userSchema);
module.exports = usermodel;
