if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
// app.use(express.json());
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpresError.js");
const session = require('express-session');
const sessionStoreMongo = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const Listing = require("./models/listing.js"); ////

const listingsRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/review.js');
const userRoute = require('./routes/user.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname, "/public")));
// console.log(app.set('views', path.join(__dirname, 'views')));

// const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

async function dbConnection() {
  try{
    await mongoose.connect(dbUrl);
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

// store session data in MongoStore
const sessionStore = sessionStoreMongo.create({
  mongoUrl: dbUrl,
  crypto: {                 //encryption/decryption of session data,
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time in seconds after which the session will be updated
})

sessionStore.on("error", (error) =>{
  console.log("ERROR IN MONGO SESSION STORE", error);
})
// define session options
const sessionOptions = {
  store: sessionStore,
  secret: "secrete code",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 28 * 24 * 60 * 60 * 1000,
    maxAge: 28 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize()); // initializing Passport to work with Node.js application.
app.use(passport.session()); // sets up session support for Passport  so that it can persist login state in the user
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.infoMsg = req.flash("info");
  res.locals.currentUser = req.user;   //store to use in .ejs file, because locals  is accessible from all ejs files
 debugger;
  next();
}); 

app.use(['/listings', '/'], listingsRoute); //listings is require above
app.use('/listings/:id/reviews', reviewsRoute); //
app.use('/user', userRoute);


// if request is not match to any route the this  will execute
app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middleware
// deconstruct the err and send res.
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somting went wrong. Please try again!" } = err;
  console.log(err);
  res.render("error.ejs", { message, statusCode });
});