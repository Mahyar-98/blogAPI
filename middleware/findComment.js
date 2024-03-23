const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
  }
  req.comment = comment;
  next();
});
