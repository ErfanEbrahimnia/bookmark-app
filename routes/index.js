const express = require("express");
const router = express.Router();
const Bookmark = require("../database/models/Bookmark");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

/* GET home page. */
router.get("/", ensureAuthentication, function (req, res, next) {
  const user = req.user;

  Bookmark.query()
    .where({ userId: user.id })
    .orderBy("createdAt", "DESC")
    .then((bookmarks) => {
      res.render("index", { bookmarks, user: req.user });
    })
    .catch((error) => next(error));
});

module.exports = router;
