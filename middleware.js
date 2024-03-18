module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    //authenticate(login) user before showing form. --(passport method)
    req.flash("error", "You must be logged in to create new listings.");
    return res.redirect("/login");
  }
  next();
};
