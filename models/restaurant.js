const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload", "upload/w_200");
});
// fix the size of the image on the index page
ImageSchema.virtual("index").get(function () {
  return this.url.replace("upload", "upload/w_820,h_550,c_fill");
});
// scale the iamge for restaurant show page
ImageSchema.virtual("showPage").get(function () {
  return this.url.replace("upload", "upload/w_820,h_550,c_fit");
});

const RestaurantSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

RestaurantSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href='/restaurants/${this._id}'>${this.title}</a>`;
});

RestaurantSchema.post("findOneAndDelete", async (restaurant) => {
  if (restaurant) {
    await Review.deleteMany({ _id: { $in: restaurant.reviews } });
  }
});

// the first arg is the ingular name of the collection.
// mongoose will use restaurants as collection in the database.
const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
