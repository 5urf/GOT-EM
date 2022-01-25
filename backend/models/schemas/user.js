const { Schema } = require("mongoose");
const productSchema = require("./product");
const shortId = require("./types/shortId");

const UserSchema = new Schema(
  {
    shortId,
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default:
        "https://elice-team7.s3.ap-northeast-2.amazonaws.com/41_1640284728547.png",
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = UserSchema;
