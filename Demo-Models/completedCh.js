const mongoose = require("mongoose")

const completedChSchema = new mongoose.Schema({
  titleName: String,
  challengeName: { type: mongoose.Schema.Types.ObjectId, ref: "challenges", required: true },
  challengeLink: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }
})

module.exports = mongoose.model("completedCh", completedChSchema)