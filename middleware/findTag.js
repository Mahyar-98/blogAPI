const Tag = require("../models/tag");
const asyncHandler = require("express-async-handler");

// Looks for the tag with the specified name in params and
// if found, attaches it to req.tag

module.exports = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findOne({ name: req.params.tagName });
  if (!tag) {
    res.status(404).json({ error: "Tag not found" });
  }
  req.tag = tag;
  next();
});
