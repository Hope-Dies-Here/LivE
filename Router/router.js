const express = require("express")
const router = express.Router()
const users = require("../Models/Users")
const challenges = require("../Models/Challenges")
const myTempDb = [{
  id: 1,
  name: "Portfolio Clone",
  link: "https://Portfolioclone.zele.com",
  uname: "Zele"
},  
{
  id: 6,
  name: "Validation",
  link: "Validation.com",
  uname: "Beki"
}, 
{
  id: 7,
  name: "For Eyes Clone",
  link: "ForEyesClone.com",
  uname: "user"
}, 
{
  id: 8,
  name: "Array",
  link: "array.com",
  uname: "Annon"
}, 
{
  id: 9,
  name: "Sporify Clone",
  link: "spot.com",
  uname: "Beki"
}, 
]
const userss = [{
  name: 'ADMIN',
  username: 'admin',
  password: 'admin'
},
{
  name: 'USER',
  username: 'user',
  password: 'user'
}
]

let showProNav = false
let msg = ''

//middleware
const validUser = (req, res, next) => {
  if(req.session.validUser) {
    
  }
}

router.get("/", async(req, res) => {
    res.render("index", { page: "home", show: showProNav })
})

//login
router.get('/login', (req, res) => {
  res.render("index", { page: "login", show: showProNav, msg: req.session.msg })
})

router.post("/login", async(req, res) => {
  const uname = req.body.uname
  const passwd = req.body.passwd
  const session = req.session
  const foundUser = await users.findOne({ username: uname, password: passwd}) 
  if(foundUser) {
    session.validUser = foundUser.name
    session.validUname = foundUser.username
    session.id69 = foundUser._id
    showProNav = true
    if(foundUser.username === "admin") req.session.adm69 = true
    res.redirect("/")
  } else {
    console.log("wef bro mnm user yelem")
    req.session.msg = 'Yehone neger lk adelem'
    res.redirect("/login")
  }
})

//register
router.post("/register", (req, res) => {
  const name = req.body.name
  console.log(name)
})

//get submit
router.get("/submit", (req, res) => {
  if(req.session.validUser){
    res.render("index", { page: "submit", show: showProNav })
  } else{
    res.redirect("/login")
  } 
})
//post submit
router.post('/submit', async(req, res) => {
  if(req.body.name != "" && req.body.link != ""){
  try{
    const acceptedData = new challenges({
      challengeName: req.body.name,
      challengeLink: req.body.link,
      owner: req.session.id69
    })
    await acceptedData.save()
  } catch(err) {
    console.log(err)
    res.redirect("/submit")
  }
    // myTempDb.push({name: req.body.name, link: req.body.link, uname: req.session.validUname})
      res.redirect('/challenges')
  } else {
    res.send("err maybe")
  }
})

//get profile
router.get("/profile", async(req, res) => {
  const name = req.session.validUser
  try{
    const db = await challenges.find({owner : req.session.id69})
    if(name && db){
      res.render("index", { db: db, name: name, page: "profile", show: showProNav, request: "direct"})
    } else {
      res.status(404).redirect("/login")
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({err: "couldn't read from server"})
  }
})

//get challenges 
router.get('/challenges', async(req, res) => {
  // const db = myTempDb.map(link => link).reverse()
  const db = await challenges.find({}).populate("owner")
  console.log(db)
  res.render('index', {page: "review", db: db, show: showProNav, uname: req.session.validUname})
})
//challenge owners
router.get("/owners/:id", (req, res) => {
  const name = myTempDb.find(link => link.uname === req.params.id)
  const db = myTempDb.filter(link => link.uname === req.params.id)
  if(db && name){
    res.render("index", { page: "profile", show: showProNav, db: db, name: name.uname, request: "alt"})
    console.log(db)
  } else {
    res.send('undefined')
  }
})
//edit my link
router.get("/challenges/edit/:id", (req, res) => {
  const data = myTempDb.find(link => link.id == req.params.id)
// --------- this line should be watched a|gain -----------
  if(data.uname === req.session.validUname){
    res.send(`<input type='text' value=${data.link} />`)
  } else {
    res.status(404).send('404')
  }
// --------- this line should be watched again -----------
})
//todo //FAQ
router.get("/todo", (req, res) => {
  res.render("index", { page: "faq", show: showProNav})
})

//logout
router.post("/logout", (req, res) => {
  req.session.destroy()
  showProNav = false
  res.redirect("/")
})

module.exports = router