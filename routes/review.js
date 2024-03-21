const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/Review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");

// review
// post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body.review);
    let newReview = new Review(req.body.review); //Review is a model and it is used to create a new review
    newReview.author = req.user._id;
    listing.reviewDetails.push(newReview); //'reviewDetails' is a array and every listings have its own array, (define in listing.js file)
    // so we can push newReview into reviews array of listings
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review route
router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewID } = req.params;
    // console.log(id, " ", reviewID);
    await Listing.findByIdAndUpdate(id, { $pull: { reviewDetails: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
