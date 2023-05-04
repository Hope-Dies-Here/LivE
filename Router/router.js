const express = require("express");
const bcrypt = require("bcryptjs");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();
const users = require("../Models/Users");
const challenges = require("../Models/Challenges");

/*
// Compare a password

*/

let msg = "";

//middleware
const validUser = (req, res, next) => {
  if (req.session.validUser) {
  }
};

router.get("/", async (req, res) => {
/* // Hash a password
  let hPassword = "dummy69";
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(hPassword, salt, async (err, hash) => {
      console.log(hash);
      await users.updateOne({username: "Dummy"}, {$set : {password: hash}})
      // Store the hash in the database
    });
  }); */
  res.render("index", {
    page: "home",
    show: req.session.showProNav,
  });
});

//login
router.get("/login", (req, res) => {
  res.render("index", {
    page: "login",
    show: req.session.showProNav,
    msg: req.session.msg,
  });
});

router.post("/login", async (req, res) => {
  const uname = req.body.uname;
  const passwd = req.body.passwd;
  const session = req.session;
  const foundUser = await users.findOne({ username: uname });
  try {
    if (foundUser) {
      bcrypt.compare(passwd, foundUser.password, (err, isMatch) => {
        if (err) {
          // Handle the error
          console.log("error comparing");
        } else if (!isMatch) {
          // Password doesn't match
          req.session.msg = "Password lk adelem";
          res.redirect("/login");
          console.log("password didnt match");
        } else {
          // Password matches
          console.log(" hash ");
          session.validUser = foundUser.name;
          session.validUname = foundUser.username;
          session.id69 = foundUser._id;
          req.session.showProNav = true;
          res.redirect("/");
        }
      });
    } else {
      req.session.msg = "Username not found";
      res.redirect("/login")
    }
  } catch (err) {
    res.status(500).json({ msg: "login err" });
  }
});

//register
router.post("/register", (req, res) => {
  const name = req.body.name;
});

//get submit
router.get("/submit", (req, res) => {
  if (req.session.validUser) {
    res.render("index", { page: "submit", show: req.session.showProNav });
  } else {
    res.redirect("/login");
  }
});
//post submit
router.post("/submit", [body("name"), body("link")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(404).json({ msg: "validation not passed" });
  if (req.body.name != "" && req.body.link != "") {
    try {
      const acceptedData = new challenges({
        challengeName: req.body.name,
        challengeLink: req.body.link,
        owner: req.session.id69,
      });
      await acceptedData.save();
    } catch (err) {
      console.log(err);
      res.redirect("/submit");
    }
    res.redirect("/challenges/1");
  } else {
    res.send("err maybe");
  }
});

//get profile
router.get("/profile", async (req, res) => {
  const name = req.session.validUser;
  try {
    const usersDb = await users.findOne({ _id: req.session.id69 });
    const db = await challenges
      .find({ owner: req.session.id69 })
      .populate("owner")
      .sort({ _id: -1 });
    if (name && db) {
      res.render("index", {
        db: db,
        user: usersDb,
        name: name,
        page: "profile",
        show: req.session.showProNav,
        request: "direct",
      });
    } else {
      res.status(404).redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "couldn't read from server" });
  }
});

//get challenges
router.get("challenges", (req, res) => {
  res.redirect("/challenges/1");
});

router.get(
  "/challenges/:page",
  [param("page").isInt().toInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(500).json({ msg: "nice try" });

    const page = req.params.page || 1;
    const perPage = 8;
    const skip = perPage * page - perPage;
    const limit = perPage;
    try {
      const fullDb = await challenges.find();
      const db = await challenges
        .find()
        .populate("owner")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      res.render("index", {
        page: "review",
        db: db,
        show: req.session.showProNav,
        uname: req.session.validUname,
        current: parseInt(page),
        pages: Math.ceil(fullDb.length / perPage),
        length: fullDb.length,
      });
    } catch (err) {
      res.json({ msg: "challenges page err" });
    }
  }
);
//challenge owners
router.get("/owners/:id", async (req, res) => {
  const allChallenges = await challenges
    .find()
    .populate("owner")
    .sort({ _id: -1 });
  const targetUser = await allChallenges.filter(
    (data) => data.owner.username == req.params.id
  );
  if (targetUser.length > 0) {
    res.render("index", {
      page: "profile",
      show: req.session.showProNav,
      db: targetUser,
      name: targetUser[0].owner.name,
      request: "alt",
    });
  } else {
    res.json({ err: "undefined" });
  }
});
//edit my link
router.get("/challenges/edit/:id", async (req, res) => {
  try {
    const data = await challenges
      .findOne({ _id: req.params.id })
      .populate("owner");
    // --------- this line should be watched a|gain -----------
    if (data.owner.username === req.session.validUname) {
      res.render("index", {
        page: "edit",
        db: data,
        show: req.session.showProNav,
      });
    } else {
      res.status(404).json({ msg: "404 bro" });
    }
    // --------- this line should be watched again -----------
  } catch (err) {
    res.status(500).json({ msg: "couldnt fetch from db", err: err });
  }
});

//update
router.post("/update/:id", [body("name"), body("link")], async (req, res) => {
  if (req.session.validUname) {
    const errors = validationResult(req);
    if (!errors.isEmpty)
      return res.status(400).json({ msg: "validation not valid" });
    try {
      const { name, link } = req.body;
      if (name == "" || link == "")
        return res.status(400).json({ err: "bado bota masgebat aychalm man" });
      await challenges.updateOne(
        { _id: req.params.id },
        {
          $set: {
            challengeName: name,
            challengeLink: link,
          },
        }
      );
      console.log(`User ${req.session.validUname} updated his challenege link`);
      res.status(200).redirect("/challenges/1");
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login");
  }
});

//delete
router.post("/deletee/:id", async (req, res) => {
  try {
    if (req.session.validUname) {
      await challenges.deleteOne({ _id: req.params.id });
      res.redirect("/challenges/1");
      console.log("link deleted ");
    } else {
      res.json({ err: "who u?" });
    }
  } catch (err) {
    res.status(500).json({ err: "some error try again maybe" });
  }
});
//todo //FAQ
router.get("/todo", (req, res) => {
  res.render("index", { page: "faq", show: req.session.showProNav });
});

//logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

/*

const express = require('express');
const app = express();

const linkRegex = /^https:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

app.get('/example', (req, res) => {
  const link = req.query.link;
  if (!linkRegex.test(link)) {
    return res.status(400).send('Invalid link');
  }

  // handle valid link here
});


const { body, validationResult } = require('express-validator');

app.post('/signup', 
  body('email').isEmail().normalizeEmail(),
  body('password').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Sanitized data can be accessed using req.body
    const { email, password } = req.body;
    // Do something with the sanitized data
  }
);



const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/user', [
  body('username').trim().escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Sanitized input is available in req.body.username
  const username = req.body.username;

  // Process the sanitized input
  // ...

  res.send('User created successfully!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
const { sanitize } = require('string');

const userInput = req.body.userInput;

const sanitizedInput = sanitize(userInput).escapeHTML().s;

// use the sanitized input in your code

const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false
}));

// Middleware to check for session fixation
function checkSessionFixation(req, res, next) {
  // If the session ID was set before login, regenerate the session
  if (req.sessionID && req.cookies && !req.cookies['connect.sid']) {
    req.session.regenerate(function(err) {
      if (err) {
        console.log(err);
      }
      next();
    });
  } else {
    next();
  }
}

app.use(checkSessionFixation);

// Your other routes and middleware here

app.listen(3000);


npm install bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
bcrypt.genSalt(saltRounds, function(err, salt) {
  // Handle error if any
  // Use salt for password hashing
});
const password = 'mysecretpassword';
bcrypt.hash(password, salt, function(err, hash) {
  // Handle error if any
  // Store hash in your password database
});


const inputPassword = 'mysecretpassword';
bcrypt.compare(inputPassword, hash, function(err, result) {
  // Handle error if any
  if(result) {
    // Passwords match
  } else {
    // Passwords don't match
  }
});

*/
