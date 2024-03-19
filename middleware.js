module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
//   console.log(req.path, " ...... ", req.originalUrl);   
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;  
    // console.log(req.session.originalUrl);
    //authenticate(login) user before showing form. --(passport method)
    req.flash("error", "You must be logged in to create new listings.");
    return res.redirect("/login");
  }
  next();
};

// by default passport reset req.session, that means it also reset  the originalUrl
//  so we need to save req.sessio.originalUrl to locals, because passport have not permission to delete the locals
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.originalUrl){
        res.locals.redirectUrl = req.session.originalUrl;
        console.log("redirectUrl", res.locals.redirectUrl);
    }
    next();
}