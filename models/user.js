const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})
// this will add username and the field of password to the userschema 
UserSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', UserSchema)

module.exports = User;