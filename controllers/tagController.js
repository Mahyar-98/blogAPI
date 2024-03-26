const Post = require("../models/post");
const Tag = require("../models/tag");
const findTag = require("../middleware/findTag");
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("express-async-handler");
const debug_tag = require("debug")("tag");
const { validationResult } = require("express-validator");
const validateTag = require("../middleware/validateTag");

exports.tags_read = asyncHandler(async (req, res, next) => {
  const tags = await Tag.find();
  if (tags.length === 0) {
    return res.json({ message: "There are no tags" });
  }
  res.json(tags);
});

exports.tag_create = [
  verifyToken,
  validateTag,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const tag = new Tag({
      name: req.body.name,
      description: req.body.description,
    });
    await tag.save();
    res.status(201).json(tag);
  }),
];

exports.tag_read = [
  findTag,
  (req, res, next) => {
    res.json(req.tag);
  },
];

exports.tag_update = [
  verifyToken,
  findTag,
  validateTag,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.name) {
      req.tag.name = req.body.name;
    }
    if (req.body.description) {
      req.tag.description = req.body.description;
    }
    await req.tag.save();
    res.json(req.tag);
  }),
];

exports.tag_delete = [
  verifyToken,
  findTag,
  asyncHandler(async (req, res, next) => {
    await req.tag.remove();
    // Remove the deleted tag's ID from the tags array in all post documents
    try {
      await Post.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
    } catch (error) {
      debug_tag("Error updating posts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Tag deleted successfully" });
  }),
];
