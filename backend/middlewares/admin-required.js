const adminRequired = (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error("관리자 권한입니다");
    err.status = 401;
    next(err);
    return;
  }

  next();
};

module.exports = adminRequired;
