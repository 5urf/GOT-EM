const express = require("express");
const passport = require("passport");

const loginRequired = ((req, res) => {
  return passport.authenticate("jwt", { session: false });
})();

module.exports = loginRequired;
