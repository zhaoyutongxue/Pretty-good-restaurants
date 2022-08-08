const express = require('express')
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync')
const { route } = require('./campgrounds');
const router = express.Router({ mergeParams: true })



const reviews = require('../controllers/review')

const { ensureLogin, validateReview, isReviewAuthor } = require('../middleware')

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})



// post new review
router.post('/', ensureLogin,validateReview, catchAsync(reviews.createReview))

// delete review
router.delete('/:reviewId', ensureLogin, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router