const { Schema } = require("mongoose");
const CommentSchema = require("./comment");
const shortId = require("./types/shortId");

const PostSchema = new Schema(
  {
    shortId,
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    notice: {
      type: Boolean,
      default: false,
    },

    content: {
      type: String,
      required: true,
    },
    comments: [CommentSchema],
    commentCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

module.exports = PostSchema;
