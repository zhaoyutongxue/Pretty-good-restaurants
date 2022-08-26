const Restaurant = require("../models/restaurant.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const campID = req.params.id;
  const restaurant = await Restaurant.findById(campID).populate("reviews");
  const review = new Review(req.body.reviews);
  review.author = req.user._id;
  await review.save();
  restaurant.reviews.push(review);
  await restaurant.save();
  req.flash("success", "New review created!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const campID = req.params.id;
  const reviewId = req.params.reviewId;
  await Review.findByIdAndDelete(req.params.reviewId);
  // remove the reference in restaurant document's review field.
  await Restaurant.findByIdAndUpdate(campID, { $pull: { reviews: reviewId } });
  req.flash("warning", "Successfully deleted a review! ");
  res.redirect(`/restaurants/${req.params.id}`);
};
