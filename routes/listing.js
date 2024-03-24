const express = require("express");
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage }) //this is a folder name where we wants to save the pictures

// console.log(router);
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
// console.log(Router);


// '/listings' ----> '/'
router.route("/")
.get(wrapAsync(listingController.index))  //Index route -----> show all listings route
.post(                                    // create route                      
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createNewListing)
);

// new route
router.get("/new", isLoggedIn, listingController.newListingForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) // show route
.put(                                         // Edit route                   
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
)
.put(                     // update route
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(                // Delete route
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
)

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;