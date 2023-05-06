const express = require("express")
const compression = require("compression")
const helmet = require("helmet")
const mongoose = require("mongoose")
const session = require("express-session")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const app = express()
const router = require("./Router/router.js")
const port = process.env.PORT || 3000
require("dotenv").config()
const DB_STRING = "mongodb://mongo:zyjsGegh5OqnXc2yyvVY@containers-us-west-183.railway.app:6403"
const dbString = process.env.DB_STRING || DB_STRING
mongoose.connect(dbString)
const db = mongoose.connection
// db.on("error", console.log("error connecting db"))
db.once("open", () => {
  console.log("database databased")
  app.listen(port, () => console.log('server served'))
})

app.use(session({
  secret: "getto bird",
  resave: true,
  saveUninitialized: true
}))

app.set("view engine", "ejs")
app.set("views", "views")

app.use(compression())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/", router)


