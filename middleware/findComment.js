const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");

// Looks for the comment with the specified ID in params and
// if found, attaches it to req.comment

module.exports = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404).json({ error: "Comment not found" });
  }
  req.comment = comment;
  next();
});
