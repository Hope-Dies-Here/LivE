const express = require("express");
const demo = express.Router()
demo.get("/", (req, res) => {
  res.render("demo", { page: "home" })
})
//profile page 
demo.get("/profile", (req, res) => {
  res.render("demo", { page: "profile" })
})
//submit page
demo.get("/submit", (req, res) => {
  res.render("demo", { page: "submit" })
})

// challenge page
demo.get("/challenges", (req, res) => {
  res.render("demo", { page: "challenges" })
})

//login page
demo.get("/login", (req, res) => {
  res.render("demo", { page: "login" })
})
module.exports = demo;