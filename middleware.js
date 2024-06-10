const Listing = require('./models/listing');
const Review = require('./models/Review');
const ExpressError = require("./utils/ExpresError.js");
const { listingSchema } = require("./schema.js"); // JOI schema
const { reviewSchema } = require("./schema.js"); //JOI schema


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
//   console.log(req.path, " ...... ", req.originalUrl);   
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;  
    // console.log(req.session.originalUrl);
    //authenticate(login) user before showing form. --(passport method)
    req.flash("error", "You must be logged in to create new listings.");
    return res.redirect("/user/login");
  }
  next();
};

// by default passport reset req.session, that means it also reset  the originalUrl
//  so we need to save req.sessio.originalUrl to locals, because passport have not permission to delete the locals
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.originalUrl){
        res.locals.redirectUrl = req.session.originalUrl;
        // console.log("redirectUrl", res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner = async(req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error", "You are not the Owner of this listing");
     return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    let { id , reviewID } = req.params;
    // console.log(reviewID);
    let review = await Review.findById(reviewID);
    // console.log(review);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the Owner of this review");
        return res.redirect(`/listings/${id}`);
       }
       next();
    }


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    // console.log(req.body);  
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      console.log("error", error);
      // res.send({erro: "error", status: 400})
      res.status(400).send(error)
      // throw new ExpressError(400, error);
    } else {
      next();
    }
  };