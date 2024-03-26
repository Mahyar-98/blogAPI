const { checkSchema } = require("express-validator");
const Tag = require("../models/tag");

module.exports = checkSchema(
  {
    name: {
      trim: true,
      notEmpty: {
        errorMessage: "Tag name should not be empty.",
      },
      isUnique: {
        custom: async (value) => {
          const tag = await Tag.findOne({ name: value });
          if (tag) {
            throw new Error("Tag already exists");
          }
        },
      },
    },
    description: {
      trim: true,
    },
  },
  ["body"],
);
