const express = require("express");
const router = express.Router();
const { Product, User } = require("../models/index");
const asyncHandler = require("../utils/async-handler");
const adminRequired = require("../middlewares/admin-required");
const loginRequired = require("../middlewares/login-required");

router.get(
  loginRequired,
  "/", 
  asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;
    const { created, like, price, releaseDate } = req.query; 

    let sortConfig = {}; 
    like === "asc"
      ? (sortConfig["likeCount"] = 1)
      : like === "desc"
      ? (sortConfig["likeCount"] = -1)
      : null;
    created === "asc"
      ? (sortConfig["createdAt"] = 1)
      : created === "desc"
      ? (sortConfig["createdAt"] = -1)
      : null;
    price === "asc"
      ? (sortConfig["price"] = 1)
      : created === "desc"
      ? (sortConfig["price"] = -1)
      : null;
    releaseDate === "asc"
      ? (sortConfig["releaseDate"] = 1)
      : releaseDate === "desc"
      ? (sortConfig["releaseDate"] = -1)
      : null;

    let products = await Product.find({})
      .sort(sortConfig)
      .populate("author")
      .skip(perPage * (page - 1)) 
      .limit(perPage); 
    products = products.reduce((acc, product) => {
      // 좋아요 처리
      return [...acc, { ...product.toObject(), isLike: false }];
    }, []);
    const totalData = await Product.countDocuments({});

    const totalPage = Math.ceil(totalData / perPage);

    if(req.user){
      const { likes } = await User.findOne({ shortId: req.user.shortId });

      products.forEach((product) => {
        if (likes.indexOf(product.shortId) != -1) {
          product.isLike = true;
        }
    });
    }
    res.status(200).json({ page, totalData, totalPage, perPage, products });
  })
);

// 단일 상품조회
router.get("/:productId",loginRequired,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({ shortId: productId });
    
    if (!req.user) { 
      res.status(200).json({ ...product.toObject(), isLike: false });
      return;
    }
    const { likes } = await User.findOne({ shortId: req.user.shortId }); 

    const index = likes.indexOf(productId);
    if (index != -1) {
      // 이미 좋아하고있는 상품이라면
      res.status(200).json({ ...product.toObject(), isLike: true });
    } else {
      res.status(200).json({ ...product.toObject(), isLike: false });
    }
  })
);

//좋아요기능
router.get(
  "/:productId/like",
  loginRequired,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { likes } = await User.findOne({ shortId: req.user.shortId });

    const index = likes.indexOf(productId);
    if (index != -1) {
      
      const product = await Product.findOneAndUpdate(
        { shortId: productId },
        { $inc: { likeCount: -1 } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { shortId: req.user.shortId },
        { $pull: { likes: productId } }
      );
      res.status(200).json({
        ...product.toObject(),
        isLike: false,
      });
    } else {
      
      const product = await Product.findOneAndUpdate(
        { shortId: productId },
        { $inc: { likeCount: 1 } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { shortId: req.user.shortId },
        { $push: { likes: productId } }
      );
      res.status(200).json({
        ...product.toObject(),
        isLike: true,
      });
    }
  })
);

//어드민 상품등록
router.post("/enroll",loginRequired,adminRequired,asyncHandler(async (req, res) => {
    const {modelName,modelNumber,series,color,price,releaseDate,imageUrl,} = req.body;
    const adminUser = await User.findOne({ shortId: req.user.shortId });

    //상품 등록
    const enrolledProduct = await Product.create({
      modelName,
      modelNumber,
      series,
      color,
      price,
      releaseDate,
      imageUrl,
      author: adminUser,
    });
    res.status(200).json(enrolledProduct);
  })
);

//어드민 상품 수정
router.put("/enroll",loginRequired,adminRequired,asyncHandler(async (req, res) => {
    const productId = Object.keys(req.query)[0];
    const {
      modelName,
      modelNumber,
      series,
      color,
      price,
      releaseDate,
      imageUrl,
    } = req.body;
    
    const updatedProduct = await Product.findOneAndUpdate(
      { shortId: productId },
      {
        modelName,
        modelNumber,
        series,
        color,
        price,
        releaseDate,
        imageUrl,
      },
      { new: true }
    ).populate("author");
    res.status(200).json(updatedProduct);
    return;
  })
);

//해당 어드민이 등록한 상품 모아보기.
router.get(
  "/admin/:adminId",
  loginRequired,
  adminRequired,
  asyncHandler(async (req, res) => {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;

    const { adminId } = req.params;
    const adminUser = await User.findOne({ shortId: adminId });
    const products = await Product.find({ author: adminUser })
      .sort({ createdAt: -1 })
      .populate("author")
      .skip(perPage * (page - 1)) 
      .limit(perPage); 
    const totalData = await Product.countDocuments({ author: adminUser });

    const totalPage = Math.ceil(totalData / perPage);

    res.status(200).json({ page, totalData, totalPage, perPage, products });
  })
);

// 상품삭제하기
router.delete("/:productId",loginRequired, async (req, res) => {
  const { productId } = req.params;

  await Product.deleteOne({ shortId: productId });
  res.status(200).json({ message: "상품 삭제 완료" });
});

module.exports = router;
