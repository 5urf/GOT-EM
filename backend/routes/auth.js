const { Router } = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = Router();

// 로그인
router.post("/", async (req, res, next) => {
  try {
    passport.authenticate("local", (passportError, user, info) => {
      if (passportError || !user) {
        res.status(400).json({ message: info.message });
        return;
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.json(loginError);
          return;
        }
        const token = jwt.sign(
          { 
            email: user.email, 
            name: user.name 
          },

          process.env.JWT_AUTHORIZATION_KEY,
          { expiresIn: 60 * 180 }
        );
        res.json({ user, token });
      });
    })(req, res);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
