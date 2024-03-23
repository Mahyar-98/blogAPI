const asyncHandler = require("express-async-handler");
const debug_tag = require("debug")("tag")
const Tag = require("../models/tag");
const Post = require("../models/post");
const { validationResult } = require("express-validator");
const validateTag = require("../middleware/validateTag");

exports.tags_read = asyncHandler(async(req, res, next) => {
    const tags = await Tag.find()
    res.json(tags);
})

exports.tag_create = [validateTag, asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const tag = new Tag({
        name: req.body.name,
        description: req.body.description,
    })
    await tag.save();
    res.status(201).json(tag)
})]

exports.tag_read = asyncHandler(async(req, res, next) => {
    const tag = await Tag.findById(req.params.tagId)
    if (!tag) {
        res.status(404).json({ error: "Tag not found" })
    }
    res.json(tag);
})

exports.tag_update = [validateTag, asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const tag = await Tag.findById(req.params.tagId)
    if (!tag) {
        res.status(404).json({ error: "Tag not found" })
    }
    tag.name = req.body.name;
    tag.description = req.body.description;
    await  tag.save();
    res.json(tag);
})]

exports.tag_delete = asyncHandler(async(req, res, next) => {
    await Tag.findByIdAndDelete( req.params.tagId );
    // Remove the deleted tag's ID from the tags array in all post documents
    try {
        await Post.updateMany(
            { "tags": tagId },
            { $pull: { "tags": tagId } }
        );
    } catch (error) {
        debug_tag("Error updating posts:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Tag deleted successfully" });
});