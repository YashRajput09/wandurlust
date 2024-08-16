const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

const listingController = require("../controllers/user");

router
  .route("/signup")
  .get(listingController.signUpForm)
  .post(wrapAsync(listingController.signUpUser));

router
  .route("/login")
  .get(listingController.logInForm)
  .post(
    saveRedirectUrl, //save the redirect url in session before logging in
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    listingController.logInUser
  );

router.get("/logout", listingController.logOutUser);

router
  .route('/forgotPassword')
  .get(listingController.renderForgotPasswordForm)
  .post(listingController.forgotPassword);
  
router
  .route('/resetPassword/:token')
  .get(listingController.renderResetPasswordForm)
  .post(listingController.resetPassword);

module.exports = router;
