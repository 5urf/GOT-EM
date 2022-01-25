const mongoose = require("mongoose");
const postSchema = require("./schemas/post");
const productSchema = require("./schemas/product");
const userSchema = require("./schemas/user");
const commentSchema = require("./schemas/comment");

exports.Post = mongoose.model("Post", postSchema);
exports.Product = mongoose.model("Product", productSchema);
exports.User = mongoose.model("User", userSchema);
exports.Comment = mongoose.model("Comment", commentSchema);
