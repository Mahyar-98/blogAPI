const User = require("../models/user");
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const {
  validateUserCreate,
  validateUserUpdate,
} = require("../middleware/validateUser");

exports.users_read = [
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const users = await User.find();
    if (users.length === 0) {
      return res.json({ message: "There are no users" });
    }
    res.json(users);
  }),
];

exports.user_create = [
  validateUserCreate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user);
  }),
];

exports.user_read = [
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }),
];

exports.user_update = [
  verifyToken,
  validateUserUpdate,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (req.body.first_name) {
      user.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
      user.last_name = req.body.last_name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    res.json(user);
  }),
];
