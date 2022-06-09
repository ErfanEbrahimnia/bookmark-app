const { Model } = require("objection");

class Bookmark extends Model {
  static get tableName() {
    return "bookmarks";
  }
}

module.exports = Bookmark;
