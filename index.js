const express = require("express")
const compression = require("compression")
const helmet = require("helmet")
const mongoose = require("mongoose")
const session = require("express-session")
const MemoryStore = require("memorystore")(session);
const ejs = require("ejs")
const bodyParser = require("body-parser")
const app = express()
const router = require("./Router/router.js")
const port = process.env.PORT || 3000
require("dotenv").config()

const dbString = process.env.LOCAL_DB_STRING ||  process.env.DB_STRING 
mongoose.connect(dbString)
const db = mongoose.connection
// db.on("error", console.log("error connecting db"))
db.once("open", () => {
  console.log("database databased")
  app.listen(port, () => console.log(`server serveda at ${port}`))
})

app.use(session({
  secret: process.env.SESSION_KEY,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  resave: false,
  saveUninitialized: true
}))

app.set("view engine", "ejs")
app.set("views", "views")

app.use(compression())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use("/", router)

