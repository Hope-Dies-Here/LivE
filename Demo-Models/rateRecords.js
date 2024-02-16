const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "completedCh", required: true },
  rate: {type: Number, required: true, max: 3}
})

module.exports = mongoose.model("records", usersSchema)