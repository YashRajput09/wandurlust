const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    //   console.log(registeredUser);
    req.login(registeredUser, (err) => {
      // when user signUp then it will be  called automatically by passport
      if (err) {
        //that user login automatically
        return next(err);
      }
      req.flash("success", "Registered successfully, Welcome to WanderLust !");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.logInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logInUser = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  // res.redirect("/listings");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
