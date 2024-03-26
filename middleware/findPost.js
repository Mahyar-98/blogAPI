const Post = require("../models/post");
const asyncHandler = require("express-async-handler");

// Looks for the post with the specified title in params and
// if found, attaches it to req.post

module.exports = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ title_url: req.params.postTitle }).populate(
    "tags",
  );
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  req.post = post;
  next();
});
