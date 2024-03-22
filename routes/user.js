const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const listingController = require("../controllers/user");

router.route("/signup")
.get(listingController.signUpForm)
.post(wrapAsync(listingController.signUpUser));

router.route("/login")
.get(listingController.logInForm)
.post(
  saveRedirectUrl, //save the redirect url in session before logging in
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  listingController.logInUser
);

router.get("/logout", listingController.logOutUser);

module.exports = router;
