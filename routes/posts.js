const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.posts_read);
router.post("/", postController.post_create);
router.get("/:postTitle", postController.post_read);
router.put("/:postTitle", postController.post_update);
router.delete("/:postTitle", postController.post_delete);

module.exports = router;
