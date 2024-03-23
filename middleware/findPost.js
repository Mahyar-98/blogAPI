const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ title_url: req.params.title_url }).populate(
    "user",
  );
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  req.post = post;
  next();
});
