const { checkSchema } = require("express-validator");

module.exports = checkSchema(
  {
    title: {
      trim: true,
      notEmpty: {
        errorMessage: "Post subject should not be empty.",
      },
    },
    body: {
      trim: true,
      notEmpty: {
        errorMessage: "Post content should not be empty.",
      },
    },
    isPublished: {
      isBoolean: {
        errorMessage: "isPublished must be a boolean.",
      },
    },
    isDeleted: {
      isBoolean: {
        errorMessage: "isDeleted must be a boolean.",
      },
    },
    title_url: {
      notEmpty: {
        errorMessage: "title_url is required.",
      },
    },
  },
  ["body"],
);
