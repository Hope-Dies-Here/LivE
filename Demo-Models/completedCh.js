const mongoose = require("mongoose")

const completedChSchema = new mongoose.Schema({
  titleName: String,
  challengeName: { type: mongoose.Schema.Types.ObjectId, ref: "challenges", required: true },
  challengeLink: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  rate: String,
  records: [Number],
  ratedBy: [String]
})

module.exports = mongoose.model("completedCh", completedChSchema)