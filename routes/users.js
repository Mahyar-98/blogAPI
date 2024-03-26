const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.users_read);
router.post("/", userController.user_create);
router.get("/:userId", userController.user_read);
router.put("/:userId", userController.user_update);

module.exports = router;
