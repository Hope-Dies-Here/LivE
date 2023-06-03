const express = require("express")
const compression = require("compression")
const helmet = require("helmet")
const mongoose = require("mongoose")
const session = require("express-session")
const MemoryStore = require("memorystore")(session);
const ejs = require("ejs")
const bodyParser = require("body-parser")
const app = express()
const path = require("path")
const router = require("./Router/router.js")
const port = process.env.PORT || 3000
require("dotenv").config()

const dbString = process.env.DB_STRING 
mongoose.connect(dbString)
const db = mongoose.connection
// db.on("error", console.log("error connecting db"))
db.once("open", () => {
  console.log("database databased")
  app.listen(port, () => console.log(`server serveda at ${port}`))
})
// app.set("trust proxy", 1);
// app.use(session({
// //   secret: process.env.SESSION_KEY,
// //   cookie: { maxAge: 86400000 },
// //   store: new MemoryStore({
// //     checkPeriod: 86400000
// //   }),
// //   resave: false,
// //   saveUninitialized: true
//   secret: process.env.SESSION_KEY,
//     resave: false,
//     saveUninitialized: true,
//     proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
//     name: 'MyCoolWebAppCookieName', // This needs to be unique per-host.
//     cookie: {
//       secure: true, // required for cookies to work on HTTPS
//       httpOnly: false,
//       sameSite: 'none'
//     }
// }))

app.set('trust proxy', 1);

app.use(session({
cookie:{
    secure: true,
    maxAge:60000
       },
store: new RedisStore(),
secret: process.env.SESSION_KEY,
saveUninitialized: true,
resave: false
}));

// app.use(function(req,res,next){
// if(!req.session){
//     return next(new Error('Oh no')) //handle error
// }
// next() //otherwise continue
// });


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));

app.use(compression())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public/"));
app.use("/", router)

