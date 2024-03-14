const express  = require('express');
const router = express.Router();
console.log(router);
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpresError.js");
const { listingSchema } = require("../schema.js"); // JOI schema 
const Listing = require("../models/listing.js");


// console.log(Router);

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

//Index route -----> show all listings route
// '/listings' ----> '/'
router.get(
    "/",
    wrapAsync(async (req, res) => {
      //find all listings in the database and send them back as a response
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
      // res.send("working..")
    })
  );
  
  // new route
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  // show route
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id).populate("reviewDetails");
      console.log();
      res.render("listings/show.ejs", { listing });
    })
  );

  // create route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      // let { title, description, image, price, location, country} = req.body;
      // let listing = req.body.listing;1
  
      //get data from req.body.linting create new listing,, listing  is an instance of our model
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      // console.log(listing);
      res.redirect("/listings");
    })
  );
  
  // Edit route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      const { id } = req.params;
      // find listing by id,
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
      // res.send("working");
    })
  );
  
  // update route
  router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      // let body = req.body.listing
      // console.log(body);
      // console.log({req.body.listing});
  
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct/destructure object and update  the fields that have been changed
      // redirect to the detail page for that listing
      res.redirect(`/listings/${id}`);
    })
  );
  
  // Delete route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
    })
  );

  module.exports = router;