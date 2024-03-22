const express = require("express");
const router = express.Router();
// console.log(router);
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
// console.log(Router);

//Index route -----> show all listings route
// '/listings' ----> '/'
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.newListingForm);

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createNewListing)
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
