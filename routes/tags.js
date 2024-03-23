const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

router.get("/", tagController.tags_read);
router.post("/", tagController.tag_create);
router.get("/:tagId", tagController.tag_read);
router.put("/:tagId", tagController.tag_update);
router.delete("/:tagId", tagController.tag_delete);

module.exports = router;
