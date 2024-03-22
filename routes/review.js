const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const listingController = require("../controllers/review.js");

// review
// post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.createReview)
);

// Delete Review route
router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(listingController.deleteReview)
);

module.exports = router;
