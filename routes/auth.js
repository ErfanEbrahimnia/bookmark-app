const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/auth/login", function (req, res) {
  res.render("login");
});

router.get("/auth/logout", function (req, res) {
  req.logout(() => {
    res.redirect("/");
  });
});

router.get(
  "/auth/github/login",
  passport.authenticate("github"),
  function (req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res, next) {
    res.redirect("/");
  }
);

module.exports = router;
