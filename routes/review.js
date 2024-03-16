const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresError.js");
const { reviewSchema } = require("../schema.js"); //JOI schema
const Review = require("../models/Review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
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

// review
// post route
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let listing = await Listing.findById(req.params.id);
      // console.log(req.body.review);
      let newReview = new Review(req.body.review); //Review is a model and it is used to create a new review
      listing.reviewDetails.push(newReview); //'reviewDetails' is a array and every listings have its own array, (define in listing.js file)
      // so we can push newReview into reviews array of listings
      await newReview.save();
      await listing.save();
      req.flash("success", "New Review Created!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  // Delete Review route
  router.delete("/:reviewID", wrapAsync(async (req, res) =>{
    let {id, reviewID} = req.params;  
    // console.log(id, " ", reviewID);
    await Listing.findByIdAndUpdate(id, {$pull: {reviewDetails: reviewID}})
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  }));

  module.exports = router;