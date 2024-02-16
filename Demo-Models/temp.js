const mongoose = require("mongoose")

const temp = new mongoose.Schema({
  titleName: String,
  challengeName: { type: mongoose.Schema.Types.ObjectId, ref: "challenges", required: true },
  challengeLink: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  rate: { type: mongoose.Schema.Types.ObjectId, ref: "rate", required: true }
})

module.exports = mongoose.model("temp", temp)