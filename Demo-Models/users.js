const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String
})

module.exports = mongoose.model("users", usersSchema)