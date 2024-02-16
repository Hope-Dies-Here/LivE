const express = require("express");
const demo = express.Router();
const testRoute = require("./sub-router/test.js");
const bcrypt = require("bcryptjs");
const challenges = require("../Demo-Models/challenges.js");
const completedCh = require("../Demo-Models/completedCh.js");
const users = require("../Demo-Models/users.js");
const rate = require("../Demo-Models/rate.js");

//middleware
const checkAuth = (req, res, next) => {
  if (typeof req.session.auth == "undefined") {
    
    req.flash("login_err_msg", "Login first");
    
    return res.redirect(`/demo/users/login?return=${req.originalUrl}`);
    
  }
  next();
};

//sup admin
const superAuth = (req, res, next) => {
  if (typeof req.session.superAuth == "undefined") {
    return res.redirect("/demo");
  }
  next();
};

demo.get("/test", testRoute);

//home page
demo.get("/", (req, res) => {
  
  res.render("demo", {
    page: "home",
    pageTitle: "Home",
    username: req.session.username,
    auth: req.session.auth,
    userData: req.session.userData,
  });
  
});

//profile page
demo.get("/profile", checkAuth, async (req, res) => {
  console.log("jquerybby")
  try {
    const curUser = await users.findOne({ username: req.session.username });
    
    const userCompletedChallenges = await completedCh
      .find({ owner: curUser._id })
      .sort({ $natural: -1 })
      .populate("challengeName");
      
    res.render("demo", {
      page: "profile",
      pageTitle: "Profile",
      auth: req.session.auth,
      userData: req.session.userData,
      userCompletedChallenges,
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "couldn't fetch from database, try again." });
  }
});

//user profile
demo.get("/user", async (req, res) => {
  try {
    if (req.session.auth && req.query.name == req.session.userData.username) {
      return res.redirect("/demo/profile");
    }
    const curUser = await users.findOne({ username: req.query.name });
    const userCompletedChallenges = await completedCh
      .find({ owner: curUser._id })
      .sort({ $natural: -1 })
      .populate("challengeName");
    res.render("demo", {
      page: "userProfile",
      pageTitle: curUser.firstName,
      auth: req.session.auth,
      userData: curUser,
      userCompletedChallenges,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "couldn't fetch from database, try again." });
  }
});

//submit page
demo.get("/submit", checkAuth, async (req, res) => {
  try {
    const db = await challenges.find().sort({ $natural: -1 });
    res.render("demo", {
      page: "submit",
      pageTitle: "Submit",
      db,
      auth: req.session.auth,
      userData: req.session.userData,
    });
  } catch (err) {
    console.log(`err from get./submit rout ${err}`);
    res
      .status(500)
      .json({ msg: "couldn't fetch data from db, try again maybe." });
  }
});
demo.post("/submit-challenge", checkAuth, async (req, res) => {
  try {
    const chName = await challenges.findOne({ _id: req.body.challenge });
    if (chName.status == "Open") {
      const owner = await users.findOne({ username: req.session.username });
      const challengeId = chName.id;
      const ownerId = owner.id;
      const link = req.body.link;
      const data = new completedCh({
        challengeName: challengeId,
        challengeLink: link,
        owner: ownerId,
        titleName: req.body.name,
        rate: "not rated",
        records: [],
        ratedBy: []
        
      });
      await data.save();
      req.flash("suc_msg", "Your link has submitted");
      res.redirect(`/demo/details?name=${chName.name}`);
    } else {
      const err = new Error("Nice Try Buddy, I Got This One. Try Lela");
    }
  } catch (err) {
    console.log(`err from post/submit-challenge ${err}`);
    res
      .status(500)
      .json({ msg: "err while submiting yor item try again later" });
  }
});

// challenges page
demo.get("/challenges", async (req, res) => {
  try {
    const db = await challenges.find().sort({ $natural: -1 });
    res.render("demo", {
      page: "challenges",
      pageTitle: "Challenges",
      db,
      auth: req.session.auth,
      userData: req.session.userData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "err while submiting yor item try again later" });
  }
});

//submitted challenges
demo.get("/details", async (req, res) => {
  try {
    if (!req.query.name) {
      res.status(400).json({ msg: "Name parameter is missing" });
      return;
    }
    const challengeDetail = await challenges.findOne({ name: req.query.name });
    const chName = await completedCh
      .find()
      .sort({ $natural: -1 })
      .populate("challengeName")
      .populate("owner");
    const allCompletedChallenges = chName.filter(
      (ch) => ch.challengeName.name == req.query.name
    );
    if(allCompletedChallenges.length > 0){
      const ratedBy = allCompletedChallenges[0].ratedBy
      const ind = ratedBy.indexOf("dummy69")
      
    }
    res.render("demo", {
      page: "submittedChes",
      pageTitle: challengeDetail.name,
      db: allCompletedChallenges,
      auth: req.session.auth,
      userData: req.session.userData,
      challengeDetail,
     // hasRated: false,
    });
    //console.log(allCompletedChallenges);
  } catch (err) {
    console.log(`err at get/details ${err}`);
    res.status(500).json({ msg: "couldn't fetch details from db, try again" });
  }
});

//edit ch page
demo.get("/edit-challenge", checkAuth, async (req, res) => {
  try {
    const targetCh = await completedCh
      .findOne({ _id: req.query.id })
      .populate("challengeName")
      .populate("owner");
    if (targetCh.owner.username != req.session.username)
      return res.redirect("/demo");
    res.render("demo", {
      page: "edit",
      pageTitle: "Edit",
      targetCh,
      auth: req.session.auth,
      userData: req.session.userData,
    });
  } catch (err) {
    console.log(`err from edit challenges get ${err}`);
    res.status(500).json({ msg: "couldn't get details, try again" });
  }
});

//update ch "POST"
demo.post("/update-challenge", checkAuth, async (req, res) => {
  try {
    const updatedData = await completedCh.findOneAndUpdate(
      { _id: req.body.id },
      { titleName: req.body.name, challengeLink: req.body.link },
      { new: true }
    );
    
    req.flash("suc_msg", "Data updated successfully");
    res.redirect(`/demo/details?name=${req.body.challenge}`);
    const db = await completedCh.find();
  } catch (err) {
    console.log(err);
    res.redirect("/challenges");
  }
});
//delete challenge
//posible bug
demo.get("/delete-challenge", checkAuth, async (req, res) => {
  try {
    await completedCh.deleteOne({ _id: req.query.id });
    req.flash("suc_msg", "Item deleted");
    res.redirect(`/demo/details?name=${req.query.from}`);
  } catch (err) {
    console.log(err);
  }
});

//login page
demo.get("/users/login", (req, res) => {
  if (req.session.auth) return res.redirect("/demo");
  const returnUrl = req.query.return || "/demo";
  res.render("demo", {
    page: "login",
    pageTitle: "Login",
    auth: req.session.auth,
    userData: req.session.userData,
    returnUrl,
  });
});

demo.post("/users/login", async (req, res) => {
  const returnUrl = req.query.return;
  const { username, password } = req.body;
  const errors = [];
  if (username == "aidmn" && password == "a") {
    req.session.superAuth = true;
    req.session.save();
    res.redirect("/demo/super-admin-baby");
  } else {
    const foundUser = await users.findOne({ username: username });
    try {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, isMatch) => {
          if (err) {
            // Handle the error
            console.log("error comparing");
          } else if (!isMatch) {
            // Password doesn't match
            req.flash("login_err_msg", "Incorrect Password");
            req.flash("err_password", password);
            req.flash("err_username", username);
            res.redirect(`/demo/users/login?retrun=${returnUrl}`);
          } else {
            // Password matches
            req.session.userData = {
              username: foundUser.username,
              name: foundUser.firstName,
              lastName: foundUser.lastName,
            };
            req.session.username = username;
            req.session.auth = true;
            req.session.save();
            res.redirect(returnUrl);
          }
        });
      } else {
        //No Username found
        req.flash("login_err_msg", "Username not found");
        req.flash("err_password", password);
        req.flash("err_username", username);
        res.redirect(`/demo/users/login?return=${returnUrl}`);
      }
    } catch (err) {
      //Handle other errors
      res.status(500).json({ msg: "login err", err: err });
    }
  }
});

//register page
demo.get("/register", superAuth, (req, res) => {
  //return res.json({err: "noooo"})
  res.render("demo", {
    page: "register",
    pageTitle: "Register",
    auth: req.session.auth,
    userData: req.session.userData,
  });
});
demo.post("/register", superAuth, (req, res) => {
  //return res.json({err: "noooo"})
  const passwd = req.body.password;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(passwd, salt, async (err, hash) => {
      const data = new users({
        firstName: req.body.fname,
        lastName: req.body.lname,
        username: req.body.username,
        password: hash,
      });
      await data.save();
      res.redirect("/demo/users/login");
      // Store the hash in the database
    });
  });
});

demo.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// SUP
demo.get("/sup", superAuth, (req, rea) => {
  res.redirect("/super-admin-baby");
});
demo.get("/super-admin-baby", superAuth, (req, res) => {
  res.render("super", { page: "home" });
});
//post challenge page
demo.get("/sup/post-challenge", superAuth, (req, res) => {
  res.render("super", {
    page: "post_challenge",
    auth: req.session.auth,
    userData: req.session.userData,
  });
});

demo.post("/sup/post-challenge", superAuth, async (req, res) => {
  const the = req.body;
  try {
    const data = new challenges({
      name: the.challengeName.trim(),
      description: the.desc,
      status: the.status,
      deadline: the.challengeDeadline,
    });
    await data.save();
    res.status(200).json({ msg: "yaaaaaaaay inserted" });
  } catch (err) {
    console.log("data not inserted", err);
    res.status(500).json({ msg: "opppppps kodaw, data not inserted" });
  }
});
//view chalenges
demo.get("/sup/view-challenges", superAuth, async (req, res) => {
  try {
    const chs = await challenges.find().sort({ $natural: -1 });
    res.render("super", { page: "view_challenges", chs });
  } catch (err) {
    console.log(err);
  }
});
// edit challenges
demo.get("/sup/edit-ch/:id", superAuth, async (req, res) => {
  try {
    const db = await challenges.findOne({ _id: req.params.id });
    res.render("super", { page: "edit_ch", db });
  } catch (err) {
    console.log(err);
  }
});
//update challenges
demo.post("/update-challenge/:id", superAuth, async (req, res) => {
  try {
    await challenges.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        description: req.body.desc,
        status: req.body.status,
        deadline: req.body.deadline,
      }
    );
    await res.redirect("/demo/sup/view-challenges");
  } catch (err) {
    res.json({ msg: "smthing err try again" });
  }
});

//delete a challege
demo.post("/sup/del-ch", superAuth, async (req, res) => {
  try {
    await challenges.deleteOne({ _id: req.query.id });
    await completedCh.deleteOne({ challengeName: req.query.id });
    req.flash("suc_msg", "Item deleted");
    res.status(200).redirect(`/demo/sup/view-challenges`);
  } catch (err) {
    console.log(err);
  }
});

// demo.get("/rate", async (req, res) => {
//   try {
//     // res.send("this rate page")
//     const arr = ["lmao", "a"]
//     const a = arr.some(a => a == "av")
//     console.log(`this is a ${a}`)
//     const arrWo = [
//       { 
//         name: "a",
//         rate: 1,
//       },
//       { 
//         name: "b",
//         rate: 4,
//       },
//       { 
//         name: "c",
//         rate: 5,
//       },
//       { 
//         name: "d",
//         rate: 6,
//       }
//         ]
//     arrWo.push({name: "a", rate: 1})
//     console.log(arrWo)
//     const tot = arr.reduceRight((a,b) => {
//       return a+b
//     })
//     console.log(`Total Amount : ${tot}`)
//     const theRate = await rate.find();
//     const rrr = await rate.findOne({name: "Female"});
    
//     console.log(theRate);
//     res.render("demo", {
//       page: "rate",
//       auth: req.session.auth,
//       userData: req.session.userData,
//       db: theRate,
//     });

//     // await new rate({
//     //   name: "Cul Guy",
//     //   rate: "Unrated",
//     //   records: [],
//     // }).save();
//     // await insData.save()
//     //await rate.deleteOne({__v: 0})
//     // await rate.deleteOne({ name: "Female"})
//     //  console.log(theRate)
//   } catch (err) {
//     console.log(err);
//     console.log("err");
//   }
// });
demo.post("/rateIt", checkAuth, async (req, res) => {
  try {
    let rating, finalRate;
    const db = await completedCh.findOne({ _id: req.body.id }).populate("challengeName");
    const hasRated = db.ratedBy.some(a => a == req.session.username)
    if(!hasRated){
      let arr = db.records;
      arr.push(req.body.rate);
      
      const total = arr.reduceRight((a, b) => {
        return a + b;
      });
      rating = total / arr.length;
      finalRate = rating.toString().slice(0, 4);

      await completedCh.updateOne(
        { _id: req.body.id },
        {
          rate: finalRate,
          $push: { 
            ratedBy: req.session.username,
            records: parseInt(req.body.rate)
          }
          },
        { upsert: true }
      );
    } else {
      //req.session.rated = true
    }
      //const targetRate = await rate.find();
  //  console.log(targetRate);
    //console.log(req.body.id)
    //http://localhost:3001/demo/details?name=Graphics%20Challenge
    res.redirect(`/demo/details?name=${db.challengeName.name}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err while rating " });
  }
});

module.exports = demo;
