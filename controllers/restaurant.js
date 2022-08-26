const { equal } = require("joi");
const Restaurant = require("../models/restaurant.js");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  // save mongo db data into a local variable, then pass through the data and render it.
  const restaurants = await Restaurant.find().populate();
  res.render("restaurants/index", { restaurants });
};

module.exports.renderNewForm = (req, res) => {
  res.render("restaurants/new");
};

module.exports.createNewRestaurant = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.restaurant.location,
      limit: 1,
    })
    .send();
  const restaurant = new Restaurant(req.body.restaurant);
  try {
    restaurant.geometry = geoData.body.features[0].geometry;
  } catch {
    throw new ExpressError(
      `Can not recognise location:"${req.body.restaurant.location}"`,
      500
    );
  }

  restaurant.author = req.user._id;
  restaurant.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await restaurant.save();
  console.log(...req.files);
  console.log(restaurant);
  req.flash("success", "You just made a new restaurant!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.showRestaurant = async (req, res) => {
  const campID = req.params.id;
  const restaurant = await Restaurant.findById(campID)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!restaurant) {
    req.flash("error", "Can not find this restaurant!");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/show", { campID, restaurant });
};

module.exports.renderEditForm = async (req, res) => {
  const campID = req.params.id;
  const restaurant = await Restaurant.findById(campID);
  res.render("restaurants/edit", { campID, restaurant });
};

module.exports.editRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, {
    ...req.body.restaurant,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.images.push(...imgs);
  await restaurant.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await restaurant.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(restaurant);
  }
  req.flash("success", "you just updated a restaurant!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.deleteRestaurant = async (req, res) => {
  const campID = req.params.id;
  await Restaurant.findByIdAndDelete(campID);
  req.flash("warning", "restaurant deleted");
  res.redirect("/restaurants");
};
