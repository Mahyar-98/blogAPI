const { checkSchema } = require("express-validator");

module.exports = checkSchema(
  {
    name: {
      trim: true,
      notEmpty: {
        errorMessage: "Comment should not be empty.",
      },
    },
    description: {
        trim: true,
    },
  },
  ["body"],
);
