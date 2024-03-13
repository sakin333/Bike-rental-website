const mongoose = require("mongoose");
const bikeSchema = new mongoose.Schema({
  bike_brand: String,
  bike_name: String,
  model_year: String,
  color: String,
  price: Number,
  image: String,
  description: String,
  booking: [{
    name: String,
    startTime: String,
    endTime: String,
    accepted: Boolean,
    status: String,
    requestId: String,
  }],
});
const bikeModel = mongoose.model("bikes", bikeSchema);
module.exports = bikeModel;
