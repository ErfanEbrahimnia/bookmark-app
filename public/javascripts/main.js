(function () {
  function createBookmark(url) {
    return fetch("/api/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    }).then((response) => response.json());
  }

  function likeBookmark(id, like) {
    return fetch(`/api/bookmarks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        like,
      }),
    });
  }

  function deleteBookmark(id) {
    return fetch(`/api/bookmarks/${id}`, {
      method: "DELETE",
    });
  }

  function removeBookmarkElement(id) {
    $(`[data-bookmark-id="${id}"]`).remove();
  }

  $("#add-bookmark").on("click", () => {
    const url = $("#bookmark-input").val();

    createBookmark(url)
      .then(() => window.location.reload())
      .catch((error) =>
        alert(
          `An error happened when trying to add a bookmark. ${error.message}`
        )
      );
  });

  $(".bookmarks-container").on("click", ".like", (event) => {
    const likeButton = $(event.currentTarget);
    const likeIcon = likeButton.children(".like-icon");
    const bookmarkElement = likeButton.parents("[data-bookmark-id]");
    const bookmarkId = bookmarkElement.data("bookmark-id");
    const liked = likeIcon.hasClass("filled");

    likeBookmark(bookmarkId, !liked)
      .then(() => {
        likeIcon.toggleClass("filled");
      })
      .catch((error) =>
        alert(
          `An error happened when trying to like the bookmark. ${error.message}`
        )
      );
  });

  $(".bookmarks-container").on("click", ".delete", (event) => {
    const bookmarkElement = $(event.currentTarget).parents(
      "[data-bookmark-id]"
    );
    const bookmarkId = bookmarkElement.data("bookmark-id");

    deleteBookmark(bookmarkId)
      .then(() => removeBookmarkElement(bookmarkId))
      .catch((error) =>
        alert(
          `An error happened when trying to remove the bookmark. ${error.message}`
        )
      );
  });
})();
