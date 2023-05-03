const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const app = express()
const router = require("./Router/router.js")

mongoose.connect("mongodb://localhost:27017/LIVE")
const db = mongoose.connection
// db.on("error", console.log("error connecting db"))
db.once("open", () => {
  console.log("database databased")
  app.listen(3000, () => console.log('server served'))
})

app.use(session({
  secret: "getto bird",
  resave: true,
  saveUninitialized: true
}))

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/", router)


