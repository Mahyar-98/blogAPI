const asyncHandler = require("express-async-handler");
const debug_post = require("debug")("post")
const Post = require("../models/post");
const Comment = require("../models/comment");
const { validationResult } = require("express-validator");
const validatePost = require("../middleware/validatePost");

// Finds the associated post and adds it to req.post
const findPost = require("../middleware/findPost");

exports.posts_read = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("user");
  res.json(posts);
});

exports.post_create = [
  validatePost,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      title_url: req.body.title_url,
      user: req.user,
      tags: req.body.tags,
    });
    await post.save();
    res.status(201).json(post);
  }),
];

exports.post_read = [
  findPost,
  (req, res, next) => {
    res.json(req.post);
  },
];

exports.post_update = [
  validatePost,
  asyncHandler(async (req, res, next) => {
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      const post = await Post.findOne({ title_url: req.params.title_url });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      post.title = req.body.title;
      post.body = req.body.body;
      post.title_url = req.body.title_url;
      post.tags = req.body.tags;
      await post.save();
      res.json(post);
    }
  }),
];

exports.post_delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ title_url: req.params.title_url });
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  await post.remove();
  // Delete all the comments associated with the removed post
  try {
    await Comment.updateMany({ post: post.id }, { isDeleted: true })
  } catch(error) {
    debug_post("Error deleting comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  res.json({ message: "Post deleted successfully" });
});
