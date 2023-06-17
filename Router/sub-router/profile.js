const express = require("express")
const profile = express.Router()
const userProfile = express.Router()

profile.get("/profile", async (req, res) => {
  try{
    const curUser = await users.findOne({ username: req.session.username });
    const userCompletedChallenges = await completedCh
      .find({ owner: curUser._id })
      .sort({ $natural: -1 })
      .populate("challengeName");
      res.render("demo", {
        page: "profile",
        auth: req.session.auth,
        userData: req.session.userData,
        userCompletedChallenges,
      });
  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: "couldn't fetch from database, try again."})
  }
});

//user profile
userProfile.get("/user", async(req, res) => {
  try{
    if(req.session.auth && req.query.name == req.session.userData.username){
      return res.redirect("/demo/profile")
    }
    const curUser = await users.findOne({ username: req.query.name });
    const userCompletedChallenges = await completedCh
      .find({ owner: curUser._id })
      .sort({ $natural: -1 })
      .populate("challengeName");
      res.render("demo", {
        page: "userProfile",
        auth: req.session.auth,
        userData: curUser,
        userCompletedChallenges,
      });
  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: "couldn't fetch from database, try again."})
  }
})

module.exports = profile;
module.exports = userProfile;
