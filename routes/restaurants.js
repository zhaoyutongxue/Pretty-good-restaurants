const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { ensureLogin, isAuthor, validateRestaurant } = require("../middleware");
// require the controller file.
const restaurants = require("../controllers/restaurant");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  //Show all restaurants:
  .get(catchAsync(restaurants.index))
  // save the new restaurant
  .post(
    ensureLogin,
    upload.array("image"),
    validateRestaurant,
    catchAsync(restaurants.createNewRestaurant)
  );

// Render the "create new restaurant page"
router.get("/new", ensureLogin, restaurants.renderNewForm);

router
  .route("/:id")
  //Show a specific restaurant:
  .get(catchAsync(restaurants.showRestaurant))
  // delete camground, and remove all reviews under the restaurant
  .delete(ensureLogin, isAuthor, catchAsync(restaurants.deleteRestaurant))
  // edit restaurant
  .put(
    ensureLogin,
    isAuthor,
    upload.array("image"),
    validateRestaurant,
    catchAsync(restaurants.editRestaurant)
  );

// render the "edit" page:
router.get(
  "/:id/edit",
  ensureLogin,
  isAuthor,
  catchAsync(restaurants.renderEditForm)
);

module.exports = router;
