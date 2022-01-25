const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/async-handler");
const hashPassword = require("../utils/hash-password");
const sendMail = require("../utils/node-mailer");
const jwt = require("jsonwebtoken");
const generatePassword = require("../utils/generate-password");
const loginRequired = require("../middlewares/login-required");
const { User } = require("../models/index");

//회원가입
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, name, isAdmin, password, phoneNumber, nickName } = req.body;

    // 이미 회원가입되어있을때
    const existedUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existedUser) {
      const err = new Error("아이디 혹은 번호로 이미 가입되었습니다.");
      err.status = 401;
      throw err;
    }

    const hashedPassword = hashPassword(password);
    const user = await User.create({
      email,
      name,
      isAdmin,
      password: hashedPassword,
      phoneNumber,
      nickName,
    });

    const token = jwt.sign(
      { email: email, name: name },
      process.env.JWT_AUTHORIZATION_KEY,
      { expiresIn: 60 * 180 }
    );
    res.json({ user, token });
  })
);

//회원탈퇴
router.get("/delete-account", loginRequired, async (req, res) => {
  await User.findOneAndDelete({
    shortId: req.user.shortId,
  });
  res.status(200).json({ message: "계정이 삭제되었습니다" });
});

router.get("/logout", (req, res) => {
  res.status(200).send({ message: "로그아웃 되었습니다" });
});

//비밀번호 찾기
router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      const error = new Error("가입되지않은 계정입니다");
      error.status = 401;
      throw error;
    }
    //메일을 먼저 보내고, 비밀번호 변경하기
    const newPassword = generatePassword();
    try {
      await sendMail(
        email,
        "TEAM7: 새로운 패스워드 입니다.",
        `요청하신 새로운 패스워드 입니다: ${newPassword}`
      );
      await User.updateOne({ email }, { password: hashPassword(newPassword) });
      res.json({ success: "메일이 발송되었습니다." });
    } catch (err) {
      const error = new Error("Server too busy");
      error.status = 421;
      throw error;
    }
  })
);

//계정찾기 
router.post(
  "/find-email",
  asyncHandler(async (req, res) => {
    const { phoneNumber, email } = req.body;
    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      const error = new Error("가입되지 않은 번호입니다.");
      error.status = 401;
      throw error;
    }
    try {
      await sendMail(
        email,
        "TEAM7: 요청하신 아이디 입니다.",
        `요청하신 아이디 입니다: ${existingUser.email}`
      );
      res.json({ success: "메일이 발송되었습니다." });
    } catch (err) {
      const error = new Error("Server too busy");
      error.status = 421;
      throw error;
    }
  })
);

module.exports = router;
