const mongoose = require("mongoose")

const rate = new mongoose.Schema({
  name: String,
  rate: String,
  records: [Number],
})

module.exports = mongoose.model("rate", rate)