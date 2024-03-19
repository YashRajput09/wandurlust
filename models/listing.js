const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");
const User = require('./user.js')

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
    type: String,
    default:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
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
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviewDetails } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
