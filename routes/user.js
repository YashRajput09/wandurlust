const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const listingController = require("../controllers/user");

router.get("/signup", listingController.signUpForm);

router.post("/signup", wrapAsync(listingController.signUpUser));

router.get("/login", listingController.logInForm);

router.post(
  "/login",
  saveRedirectUrl, //save the redirect url in session before logging in
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  listingController.logInUser
);

router.get("/logout", listingController.logOutUser);

module.exports = router;
