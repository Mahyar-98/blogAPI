const asyncHandler = require("express-async-handler");
const debug_comment = require("debug")("comment");
const Comment = require("../models/comment");
const { validationResult } = require("express-validator");
const validateComment = require("../middleware/validateComment");

// Finds the associated post and adds it to req.post
const findPost = require("../middleware/findPost"); 

// Finds the associated comment and adds it to req.comment
const findComment = require("../middleware/findComment");

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
      res.json({ message: "This post has no comments" });
    }
    res.json(comments);
  }),
];

exports.comment_create = [
  findPost,
  validateComment,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }
    const comment = new Comment({
      body: req.body.body,
      isApproved: userId ? true : false,
      user: userId,
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
  validateComment,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }
    const comment = new Comment({
      body: req.body.body,
      isApproved: userId ? true : false,
      user: userId,
      post: req.post.id,
      parentComment: req.comment.id,
    });
    await comment.save();
    res.status(201).json(comment);
  }),
];

// check if you can replace the first 4 lines with findComment and save req.comment to DB
exports.comment_update = [
  findPost,
  validateComment,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    };
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.body = req.body.body;
    comment.isApproved = req.body.isApproved;
    await comment.save();
    res.json({ message: "Comment updated successfully" });
  }),
];

// check if you can replace the first 4 lines with findComment and save req.comment to DB
exports.comment_delete = [
  findPost,
  asyncHandler(async (req, res, next) => {
    const comment = await Comment.findOne({ _id: req.params.commentId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.post.toString() !== req.post.id.toString()) {
      return res
        .status(400)
        .json({ error: "Comment does not belong to the post" });
    }
    comment.isDeleted = true;
    await comment.save();
    try {
      await deleteNestedComments(comment.id);
      res.json({ message: "Comment and its nested comments deleted successfully" });
    } catch(error) {
      debug_comment("Error deleting nested comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }),
];
