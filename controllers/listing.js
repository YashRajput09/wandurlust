const { query } = require("express");
const Listing = require("../models/listing.js");
const { generateSearchQuery, handleSearch } = require('../utils/search.js')
const { logInForm } = require("./user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_PUBLIC_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
   // get value  of the search parameter from URL and store it in searchQuery variable
  const searchQuery = req.query.search || ''; // If search is undefined or null, set it to an empty string

  // use searchListings function which takes searchQuery as argument and returns promise
  const searchListings = generateSearchQuery(searchQuery);

  //find all listings in the database and send them back as a response
   const allListings = await Listing.find(searchListings);
   
res.render("listings/index.ejs", { allListings: allListings});

  // await handleSearch(req, res, Listing); ////
};

module.exports.newListingForm = async(req, res) => {
  await handleSearch(req, res, Listing);   //search and display listing when user search
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
const { id } = req.params;
const listing = await Listing.findById(id)
.populate({ path: "reviewDetails", populate: { path: "author" } })
.populate("owner"); // populate() replace the ID with the actual document
if (!listing) {
  req.flash("error", "Requested Listing is not found.");
  res.redirect("/listings");
}

  await handleSearch(req, res, Listing); //search and display listing when user search
  res.render("listings/show.ejs", { listing });

};

module.exports.createNewListing = async (req, res, next) => {
  let getCoordinates = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();
 
// console.log("BODY : ",req.body);
// console.log("LISTING : ",req.body.listing);

  let url = req.file.path;
  let filename = req.file.filename;
  //get data from req.body.listing create new listing,, listing  is an instance of our model
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // save current(login) user's ID to owner field, so we know who created this listing, In request obj by default passport store user related info
  newListing.image = {url, filename};
  newListing.geometry = getCoordinates.body.features[0].geometry;  //save coordinates to db
  newListing.category =  req.body.listing.category;
  await newListing.save();
  // console.log("NEW LISTING : ",newListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
  // await handleSearch(req, res, Listing); /////
};

module.exports.editListingForm = async (req, res) => {

  const { id } = req.params;
  // find listing by id,
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist.");
    res.redirect("/listings");
  }

  await handleSearch(req, res, Listing); // search and display listing when user search

  let originalImageUrl = listing.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250");
  return res.render("listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  console.log(req.body);
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct/destructure object and update  the fields that have been changed
//  console.log(listing);
  if(typeof req.file !== 'undefined'){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
}
  // redirect to the detail page for that listing
  req.flash("success", "Listing Updated.");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};

module.exports.categoryListings =  async (req, res) =>{
  const  { category }  = req.query;
  const filteredListings = await Listing.find({ category });
  res.render("listings/category.ejs", { filteredListings: filteredListings });
}