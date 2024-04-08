const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
  rating: Number,
  improvement: String,
  email: String,
  user: Object,
});
const feedbackmodel = mongoose.model("feedback", feedbackSchema);
module.exports = feedbackmodel;
