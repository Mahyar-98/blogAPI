const { checkSchema } = require("express-validator");

const createCommentSchema = {
  body: {
    trim: true,
    notEmpty: {
      errorMessage: "Comment should not be empty.",
    },
  },
  name: {
    trim: true,
    notEmpty: { errorMessage: "Name should not be empty" },
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: "Email address is required." },
    isEmail: { errorMessage: "Email address is not valid." },
  },
  website: {
    trim: true,
    isURL: { errorMessage: "Invalid website URL" },
    optional: true,
  },
};

const updateCommentSchema = {
  body: {
    trim: true,
    notEmpty: {
      errorMessage: "Comment should not be empty.",
    },
    optional: true,
  },
  name: {
    trim: true,
    notEmpty: { errorMessage: "Name should not be empty" },
    optional: true,
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: "Email address is required." },
    isEmail: { errorMessage: "Email address is not valid." },
    optional: true,
  },
  website: {
    trim: true,
    isURL: { errorMessage: "Invalid website URL" },
    optional: true,
  },
  isApproved: {
    isBoolean: { errorMessage: "isApproved must be a boolean" },
    optional: true,
  },
  isDeleted: {
    isBoolean: {
      errorMessage: "isDeleted must be a boolean.",
    },
    optional: true,
  },
};

const validateCommentCreate = checkSchema(createCommentSchema, ["body"]);
const validateCommentUpdate = checkSchema(updateCommentSchema, ["body"]);

module.exports = { validateCommentCreate, validateCommentUpdate };
