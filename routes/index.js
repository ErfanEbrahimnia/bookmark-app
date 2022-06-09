const express = require("express");
const router = express.Router();
const Bookmark = require("../database/models/Bookmark");

/* GET home page. */
router.get("/", function (req, res, next) {
  Bookmark.query()
    .orderBy("createdAt", "DESC")
    .then((bookmarks) => {
      res.render("index", { bookmarks });
    })
    .catch((error) => next(error));
});

module.exports = router;
