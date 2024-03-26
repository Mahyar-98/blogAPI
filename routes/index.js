const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.use("/", indexController.home);

module.exports = router;
