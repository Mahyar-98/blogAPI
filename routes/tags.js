const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.tags_read);
router.post("/", tagController.tag_create);
router.get("/:tagName", tagController.tag_read);
router.put("/:tagName", tagController.tag_update);
router.delete("/:tagName", tagController.tag_delete);

module.exports = router;
