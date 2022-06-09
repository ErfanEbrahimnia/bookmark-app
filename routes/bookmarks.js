var express = require("express");
var router = express.Router();

router.post("/bookmarks", function (req, res, next) {
  res.json({});
});

router.patch("/bookmarks", function (req, res, next) {
  res.json({});
});

router.delete("/bookmarks", function (req, res, next) {
  res.json({});
});

module.exports = router;
