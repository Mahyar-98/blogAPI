const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

const prefix = "/:postTitle/comments";
router.get(prefix + "/", commentController.comments_read);
router.post(prefix + "/", commentController.comment_create);
router.get(prefix + "/:commentId", commentController.comment_read);
router.post(prefix + "/:commentId", commentController.child_comment_create);
router.put(prefix + "/:commentId", commentController.comment_update);
router.delete(prefix + "/:commentId", commentController.comment_delete);

module.exports = router;
