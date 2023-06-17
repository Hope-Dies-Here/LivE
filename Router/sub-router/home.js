const express = require("express")
const home = express.Router()

home.get("/", (req, res) => {
  res.render("demo", {
    page: "home",
    username: req.session.username,
    auth: req.session.auth,
    userData: req.session.userData,
  });
});

module.exports = home
