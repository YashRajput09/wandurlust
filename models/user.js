const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
    // there is no need to define other  fields like username and password 
    // because 'passport-local-mongoose' will automatically add
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);