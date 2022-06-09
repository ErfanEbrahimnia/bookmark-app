var express = require("express");
var router = express.Router();
const Bookmark = require("../database/models/Bookmark");
const ensureAuthentication = require("../middlewares/ensureAuthentication");

function createLinkPreview(url) {
  return fetch(
    `http://api.linkpreview.net/?key=${process.env.LINKPREVIEW_API_KEY}&q=${url}`
  ).then((response) => response.json());
}

router.post("/bookmarks", ensureAuthentication, async (req, res, next) => {
  try {
    const { url } = req.body;
    const user = req.user;
    const preview = await createLinkPreview(url);

    const bookmark = await Bookmark.query().insertAndFetch({
      title: preview.title,
      description: preview.description,
      url: preview.url,
      image: preview.image,
      userId: user.id,
    });

    res.json(bookmark.$toJson());
  } catch (error) {
    next(error);
  }
});

router.patch("/bookmarks/:id", ensureAuthentication, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { like } = req.body;
    const bookmark = await Bookmark.query().patchAndFetchById(id, {
      liked: like,
    });

    res.json(bookmark.$toJson());
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/bookmarks/:id",
  ensureAuthentication,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await Bookmark.query().deleteById(id);

      res.end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
