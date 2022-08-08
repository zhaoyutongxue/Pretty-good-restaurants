const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})
// the first arg is the singular name of the collection.
// mongoose will use campgrounds as collection in the database.  
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review; 
