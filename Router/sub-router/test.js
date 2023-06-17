const express = require("express")
const testRoute = express.Router()

testRoute.get("/test", (req, res) => {
  res.status(200).json({msg: "Wellcome meboy"})
})

module.exports = testRoute;