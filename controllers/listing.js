const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  //find all listings in the database and send them back as a response
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  // res.send("working..")
};

module.exports.newListingForm = (req, res) => {
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
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  //get data from req.body.linting create new listing,, listing  is an instance of our model
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // save current(login) user's ID to owner field, so we know who created this listing, In request obj by default passport store user related info
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
  const { id } = req.params;
  // find listing by id,
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist.");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
  // res.send("working");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct/destructure object and update  the fields that have been changed
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
