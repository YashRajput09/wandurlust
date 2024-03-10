const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpresError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/Review.js");
// console.log(Review);
// console.log(Review.title);
// console.log(Review.rating);
// console.log(Review.content);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "/public")));
// console.log(app.set('views', path.join(__dirname, 'views')));

async function dbConnection() {
  try{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to Mongodb");

    const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  } catch(error){
    console.error("Error connecting to mongoDB: ", error)
  }
}
dbConnection();
// .then(()=>{
//     console.log("connected with db");
// }).catch((err)=>{
//     console.log(err);
// });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

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

//show all listings route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    //find all listings in the database and send them back as a response
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    // res.send("working..")
  })
);

// new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviewDetails");
    console.log();
    res.render("listings/show.ejs", { listing });
  })
);

// create route
app.post(
  "/listings",
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
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // find listing by id,
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
    // res.send("working");
  })
);

// update route
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// review
// post route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body.review);
    let newReview = new Review(req.body.review); //Review is a model and it is used to create a new review
    listing.reviewDetails.push(newReview); //'reviewDetails' is a array and every listings have its own array, (define in listing.js file)
    // so we can push newReview into reviews array of listings
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// current working part
// Delete Review route
app.delete("/listings/:id/reviews/:reviewID", wrapAsync(async (req, res) =>{
  let {id, reviewID} = req.params;  
  // console.log(id, " ", reviewID);
  await Listing.findByIdAndUpdate(id, {$pull: {reviewDetails: reviewID}})
  await Review.findByIdAndDelete(reviewID);
  res.redirect(`/listings/${id}`);
}))

app.get("/", (req, res) => {
  res.send("working");
});

// is request is not match to any route the this  will execute
app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middleware
// deconstruct the err and send res.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somting went wrong. Please try again!" } =
    err;
  console.log(err);
  res.render("error.ejs", { message, statusCode });
  // res.status(statusCode).send(message);
  // res.send("somthing went wrong");
});


