const express = require("express");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const MemoryStore = require("memorystore")(session);
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
// const router = require("./Router/router.js")
const demo = require("./Router/demo.js");
const port = process.env.PORT || 3000;
require("dotenv").config();

// const dbString = process.env.DB_STRING
const dbString = process.env.DB_STRING;
mongoose
  .connect(dbString)
  .then(() => {
    console.log("database connected");
    app.listen(port, () => console.log(`server served at ${port}`));
  })
  .catch((error) => {
    console.error("database connection error:");
  });

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:");
});

// mongoose.connect(dbString)
// const db = mongoose.connection
// db.on("error", console.log("error connecting db"))
// db.once("open", () => {
//   console.log("database databased")
//   app.listen(port, () => console.log(`server serveda at ${port}`))
// })

app.use(
  session({
    secret: process.env.SESSION_KEY,
    cookie: { maxAge: 86400000 },
    store: MongoStore.create({ mongoUrl: dbString }),
    resave: false,
    saveUninitialized: true,
    //store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.login_err_msg = req.flash("login_err_msg");
  res.locals.suc_msg = req.flash("suc_msg");
  res.locals.err_username = req.flash("err_username");
  res.locals.err_password = req.flash("err_password");
  next();
});

app.set("view engine", "ejs");
//app.set("views", "views")
app.set("views", path.join(__dirname, "views"));

app.use(compression());
// app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
//app.use(express.static(path.join(__dirname, 'public')))
// app.use("/", router)
app.use("/demo", demo);

app.get("/", (req, res) => {
  res.redirect("/demo");
});
