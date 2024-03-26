const Comment = require("../models/comment");
const findPost = require("../middleware/findPost");
const findComment = require("../middleware/findComment");
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("express-async-handler");
const debug_comment = require("debug")("comment");
const { validationResult } = require("express-validator");
const {
  validateCommentCreate,
  validateCommentUpdate,
} = require("../middleware/validateComment");

const deleteNestedComments = async (parentId) => {
  const childComments = await Comment.find({ parentComment: parentId });
  for (const childComment of childComments) {
    // Recursively delete the child comment's children
    await deleteNestedComments(childComment._id);
    await Comment.findByIdAndUpdate(childComment._id, { isDeleted: true });
  }
};
exports.comments_read = [
  findPost,
  asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.post.id });
    if (comments.length === 0) {
      return res.json({ message: "This post has no comments" });
    }
    res.json(comments);
  }),
];

exports.comment_create = [
  findPost,
  validateCommentCreate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const comment = new Comment({
      body: req.body.body,
      name: req.body.name,
      email: req.body.email,
      website: req.body.website ? req.body.website : null,
      post: req.post.id,
      parentComment: null,
    });
    await comment.save();
    res.status(201).json(comment);
  }),
];

exports.comment_read = [
  findPost,
  findComment,
  (req, res, next) => {
    res.json(req.comment);
  },
];

exports.child_comment_create = [
  findPost,
  findComment,
  validateCommentCreate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const comment = new Comment({
      body: req.body.body,
      name: req.body.name,
      email: req.body.email,
      website: req.body.website ? req.body.website : null,
      post: req.post.id,
      parentComment: req.comment.id,
    });
    await comment.save();
    res.status(201).json(comment);
  }),
];

// check if you can replace the first 4 lines with findComment and save req.comment to DB
exports.comment_update = [
  verifyToken,
  findPost,
  findComment,
  validateCommentUpdate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.body) {
      req.comment.body = req.body.body;
    }
    if (req.body.isApproved) {
      req.comment.isApproved = req.body.isApproved;
    }
    await req.comment.save();
    res.json({ message: "Comment updated successfully" });
  }),
];

exports.comment_delete = [
  verifyToken,
  findPost,
  findComment,
  asyncHandler(async (req, res, next) => {
    if (req.comment.post.toString() !== req.post.id.toString()) {
      return res
        .status(400)
        .json({ error: "Comment does not belong to the post" });
    }
    req.comment.isDeleted = true;
    await req.comment.save();
    try {
      await deleteNestedComments(req.comment.id);
    } catch (error) {
      debug_comment("Error deleting nested comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({
      message: "Comment and its nested comments deleted successfully",
    });
  }),
];
