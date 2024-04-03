const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");
const { number } = require("joi");
// const User = require('./user.js')

//  Define the User schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviewDetails: [
    {
      type: Schema.Types.ObjectId, //storing object id insted of all  data from reviews collection
      ref: "Review", //Review  is a model name in our application
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
    enum: ['Point'], //'location.type' must be 'Point'
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
},

});

// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviewDetails } });
//   }
// });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
