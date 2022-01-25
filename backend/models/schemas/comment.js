const { Schema } = require("mongoose");
const shortId = require("./types/shortId");

const CommentSchema = new Schema(
  {
    shortId,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = CommentSchema;
