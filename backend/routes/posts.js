const express = require("express");
const router = express.Router();
const { Post, User, Product, Comment } = require("../models");
const mergeState = require("../utils/merge-state");

const loginRequired = require("../middlewares/login-required");

// 게시글 전체 조회
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const { created, view } = req.query; 
  let sortConfig = { notice: -1 };
  view === "asc"
    ? (sortConfig["viewCount"] = 1)
    : view === "desc"
    ? (sortConfig["viewCount"] = -1)
    : null;
  created === "asc"
    ? (sortConfig["createdAt"] = 1)
    : created === "desc"
    ? (sortConfig["createdAt"] = -1)
    : null;

  const product = await Product.findOne({ shortId: productId });
  
  if (!product) {
    res.status(400).json({ message: "해당제품은 삭제되었습니다" });
    return;
  }

  const total = await Post.countDocuments({ product });
  const totalPage = Math.ceil(total / perPage);

  let posts = await Post.find({ product })
    .populate(["author", "product"])
    .sort(sortConfig)
    .skip(perPage * (page - 1))
    .limit(perPage);

  res.status(200).json({ page, totalData: total, totalPage, perPage, posts });
});

// 포스팅 조회
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  let post = await Post.findOneAndUpdate(
    { shortId: postId },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate(["product", "author"]);
  if (!post) {
    res.status(400).json({ message: "해당하는 글이 없습니다." });
    return;
  }

  res.status(200).json(post);
});

// 포스팅 작성  //
router.post("/write/:productId", loginRequired, async (req, res) => {
  const { productId } = req.params; 
  const { title, content, reviews } = req.body;
  const author = await User.findOne({
    shortId: req.user.shortId,
  });

  const product = await Product.findOne({ shortId: productId });
  let cur_reviews = product.reviews; 
  cur_reviews = mergeState(cur_reviews, reviews, "merge");
  await product.updateOne({
    reviews: cur_reviews,
    $inc: { reviewsCount: 1 },
  }); 

  const post = await Post.create({
    product,
    title,
    content,
    author,
    notice: author.isAdmin ? true : false,
    reviews,
  });
  res.status(200).json(post);
});

//포스팅 수정
router.patch("/write/:postId",loginRequired, async (req, res) => {
  const { postId } = req.params;
  const { title, content, reviews } = req.body;
  
  const post = await Post.findOne({ shortId: postId }).populate("product"); 
  const rollbackReviews = post.reviews;
  
  const product = await Product.findOne({ shortId: post.product.shortId });

  let cur_reviews = product.reviews;
  cur_reviews = mergeState(cur_reviews, rollbackReviews, "rollback"); //롤백진행
  cur_reviews = mergeState(cur_reviews, reviews, "merge"); // 병합진행
  await product.updateOne({ reviews: cur_reviews }); // 리뷰교체

  const updatedPost = await Post.findOneAndUpdate(
    { shortId: postId },
    { title, content, reviews },
    { new: true }
  ).populate(["product", "author"]);
  res.status(200).json(updatedPost);
});

// 포스팅 삭제
router.delete("/:postId",loginRequired, async (req, res) => {
  const { postId } = req.params;

  // 현재 게시글의 상품에 후기 부분 전부 롤백
  const post = await Post.findOne({ shortId: postId }).populate("product"); 
  const product = await Product.findOne({ shortId: post.product.shortId }); 

  let cur_reviews = product.reviews;
  const rollbackReviews = post.reviews;
  //롤백진행
  cur_reviews = mergeState(cur_reviews, rollbackReviews, "rollback");
  await product.updateOne({
    reviews: cur_reviews,
    $inc: { reviewsCount: -1 },
  });

  //게시글삭제
  post.deleteOne();
  res.status(200).json({ message: "게시글 삭제 완료" });
});

//댓글조회
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { created } = req.query;
  const post = await Post.findOne({ shortId: postId }, "comments").populate({
    path: "comments.author",
  });
  if (!post) {
    res.status(400).json({ messaage: "게시글이 없습니다." });
    return;
  }
  let comments = post.comments;
  if (created === "desc") {
    comments.sort((a, b) => {
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }
  res.json(comments);
});

// 댓글 추가하기
router.post("/:postId/comments", loginRequired, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  const post = await Post.findOne({ shortId: postId });

  if (!post) {
    res.status(400).json({ message: "게시글이 없습니다." });
    return;
  }
  const comment = await Comment.create({
    author,
    content,
  });
  // $push operator 사용하여 댓글 추가하기
  await Post.findOneAndUpdate(
    { shortId: postId },
    { $push: { comments: comment }, $inc: { commentCount: 1 } }
  );

  res.status(200).json(comment);
});

router.delete(
  "/:postId/comments/:commentId",
  loginRequired,
  async (req, res) => {
    const { postId, commentId } = req.params;

    await Post.findOneAndUpdate(
      {
        shortId: postId,
      },
      {
        $pull: { comments: { shortId: commentId } },
        $inc: { commentCount: -1 },
      }
    );
    res.status(200).send({ message: "댓글이 삭제 되었습니다." });
  }
);

module.exports = router;
