const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");

module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewID } = req.params;
  // console.log(id, " ", reviewID);
  await Listing.findByIdAndUpdate(id, { $pull: { reviewDetails: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
};
