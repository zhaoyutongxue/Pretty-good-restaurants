const Restaurant = require("./models/restaurant.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const { restaurantSchema, reviewSchema } = require("./schemas.js");

module.exports.ensureLogin = (req, res, next) => {
  // console.log("REQ.USER:" + req.user)
  if (!req.isAuthenticated()) {
    // store the path the user wanted to visit before login
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must sign in first");
    return res.redirect("/login");
  }
  next();
};
// The middleware for restaurant authorisation
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (
    !restaurant.author._id.equals(req.user._id) &&
    !req.user._id.equals("62cd578ffa7d9f6208b2dbbe")
  ) {
    req.flash("error", "you dont have permission to do that");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};
// The middleware for review authorisation
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (
    !review.author._id.equals(req.user._id) &&
    !req.user._id.equals("62cd578ffa7d9f6208b2dbbe")
  ) {
    req.flash("error", "you dont have permission to do that");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};
// The middleware to validate restaurant input data:
module.exports.validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// The middleware to validate review input data:
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
