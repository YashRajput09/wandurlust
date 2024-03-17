const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// creating model
const Review = mongoose.model("Review", reviewSchema);
module.exports  = Review;
// module.exports = mongoose.model("review", reviewSchema);
