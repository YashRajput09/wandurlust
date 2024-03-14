const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpresError.js");

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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

app.use('/listings', listings); //listings is require above
app.use('/listings/:id/reviews', reviews); //

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