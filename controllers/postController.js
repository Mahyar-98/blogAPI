const Post = require("../models/post");
const Comment = require("../models/comment");
const Tag = require("../models/tag");
const findPost = require("../middleware/findPost");
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("express-async-handler");
const debug_post = require("debug")("post");
const { validationResult } = require("express-validator");
const {
  validatePostCreate,
  validatePostUpdate,
} = require("../middleware/validatePost");

exports.posts_read = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("tags");
  if (posts.length === 0) {
    return res.json({ message: "There are no posts" });
  }
  res.json(posts);
});

exports.post_create = [
  verifyToken,
  validatePostCreate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let tagIds;
    if (req.body.tags) {
      tagIds = await Promise.all(
        req.body.tags.map(async (tagName) => {
          return await tag.findOne({ name: tagName }).select("_id");
        }),
      );
    }
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      title_url: req.body.title_url,
      user: req.user.userId,
      tags: tagIds,
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
  verifyToken,
  findPost,
  validatePostUpdate,
  asyncHandler(async (req, res, next) => {
    {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (req.body.title) {
        req.post.title = req.body.title;
      }
      if (req.body.body) {
        req.post.body = req.body.body;
      }
      if (req.body.title_url) {
        req.post.title_url = req.body.title_url;
      }
      if (req.body.tags) {
        const tagIds = await Promise.all(
          req.body.tags.map(async (tagName) => {
            return await tag.findOne({ name: tagName }).select("_id");
          }),
        );
        req.post.tags = tagIds;
      }
      if (req.body.tag) {
        const tagId = await Tag.findOne({ name: req.body.tag }).select("_id");
        req.post.tags.push(tagId);
      }
      if (req.body.isPublished) {
        req.post.isPublished = req.body.isPublished;
      }
      await req.post.save();
      res.json(req.post);
    }
  }),
];

exports.post_delete = [
  verifyToken,
  findPost,
  asyncHandler(async (req, res, next) => {
    req.post.isDeleted = true;
    await req.post.save();
    // Delete all the comments associated with the removed post
    try {
      await Comment.updateMany({ post: req.post.id }, { isDeleted: true });
    } catch (error) {
      debug_post("Error deleting comments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Post deleted successfully" });
  }),
];
