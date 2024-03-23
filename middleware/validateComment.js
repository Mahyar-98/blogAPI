const { checkSchema } = require("express-validator");

module.exports = checkSchema(
  {
    body: {
      trim: true,
      notEmpty: {
        errorMessage: "Comment should not be empty.",
      },
    },
    isApproved: {
      isBoolean: {
        errorMessage: "isApproved must be a boolean.",
      },
    },
    isDeleted: {
      isBoolean: {
        errorMessage: "isDeleted must be a boolean.",
      },
    },
  },
  ["body"],
);
