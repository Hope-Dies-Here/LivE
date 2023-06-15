const mongoose = require("mongoose")

const challengesSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  deadline: String
})

module.exports = mongoose.model("challenges", challengesSchema)