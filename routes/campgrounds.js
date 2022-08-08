const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { ensureLogin, isAuthor, validateCampground } = require('../middleware')
// require the controller file.
const campgrounds = require('../controllers/campground')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

router.route('/')
    //Show all campgrounds:
    .get(catchAsync(campgrounds.index))
    // save the new campground
    .post(ensureLogin, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground))


// Render the "create new campground page"
router.get('/new', ensureLogin, campgrounds.renderNewForm)

router.route('/:id')
    //Show a specific campground: 
    .get(catchAsync(campgrounds.showCampground))
    // delete camground, and remove all reviews under the campground
    .delete(ensureLogin, isAuthor, catchAsync(campgrounds.deleteCampground))
    // edit campground
    .put(ensureLogin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))

// render the "edit" page:
router.get('/:id/edit', ensureLogin, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router