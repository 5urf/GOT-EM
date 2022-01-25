const { Schema } = require("mongoose");
const shortId = require("./types/shortId");

const productSchema = new Schema(
  {
    shortId,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    modelNumber: {
      type: String,
      required: true,
    },
    series: {
      type: String,
      default: "jordan",
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    reviews: {
      fit: {
        small: { type: Number, default: 0, min: 0 },
        normal: { type: Number, default: 0, min: 0 },
        big: { type: Number, default: 0, min: 0 },
      },
      feeling: {
        good: { type: Number, default: 0, min: 0 },
        moderate: { type: Number, default: 0, min: 0 },
        bad: { type: Number, default: 0, min: 0 },
      },
      color: {
        clear: { type: Number, default: 0, min: 0 },
        normal: { type: Number, default: 0, min: 0 },
        blur: { type: Number, default: 0, min: 0 },
      },
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = productSchema;
