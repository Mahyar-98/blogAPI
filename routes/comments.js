const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const comment = require("../models/comment");

router.get("/", commentController.comments_read);
router.post("/", commentController.comment_create);
router.get("/:commentId", commentController.comment_read);
router.post("/:commentId", commentController.child_comment_create);
router.put("/:commentId", commentController.comment_update);
router.delete("/:commentId", commentController.comment_delete);

module.exports = router;
