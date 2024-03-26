const { checkSchema } = require("express-validator");
const User = require("../models/user");

const createUserSchema = {
  first_name: {
    trim: true,
    notEmpty: { errorMessage: "First name is required." },
  },
  last_name: {
    trim: true,
    notEmpty: { errorMessage: "Last name is required." },
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: "Email address is required." },
    isEmail: { errorMessage: "Email address is not valid." },
    notEmailAlreadyInUse: {
      custom: async (value) => {
        const existingEmail = await User.find({ email: value });
        if (existingEmail.length !== 0) {
          throw new Error("The provided email is already in use.");
        }
        return true;
      },
    },
  },
  password: {
    trim: true,
    notEmpty: { errorMessage: "Password field should not be empty" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should have a minimum of 6 characters.",
    },
  },
  password_confirm: {
    trim: true,
    confirmPassword: {
      custom: (value, { req }) => {
        const match = value === req.body.password;
        if (!match) {
          throw new Error("Passwords do not match.");
        }
        return true;
      },
    },
  },
};

const updateUserSchema = {
  first_name: {
    trim: true,
    notEmpty: { errorMessage: "First name is required." },
    optional: true,
  },
  last_name: {
    trim: true,
    notEmpty: { errorMessage: "Last name is required." },
    optional: true,
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: "Email address is required." },
    isEmail: { errorMessage: "Email address is not valid." },
    notEmailAlreadyInUse: {
      custom: async (value) => {
        const existingEmail = await User.find({ email: value });
        if (existingEmail.length !== 0) {
          throw new Error("The provided email is already in use.");
        }
        return true;
      },
    },
    optional: true,
  },
  password: {
    trim: true,
    notEmpty: { errorMessage: "Password field should not be empty" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should have a minimum of 6 characters.",
    },
    optional: true,
  },
  password_confirm: {
    trim: true,
    confirmPassword: {
      custom: (value, { req }) => {
        const match = value === req.body.password;
        if (!match) {
          throw new Error("Passwords do not match.");
        }
        return true;
      },
    },
    optional: true,
  },
};

const validateUserCreate = checkSchema(createUserSchema, ["body"]);
const validateUserUpdate = checkSchema(updateUserSchema, ["body"]);

module.exports = { validateUserCreate, validateUserUpdate };
