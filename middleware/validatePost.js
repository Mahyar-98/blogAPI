const { checkSchema } = require("express-validator");
const Post = require("../models/post");
const Tag = require("../models/tag");

const tagIsUnique = async (postTitle, tagName) => {
  try {
    const post = await Post.findOne({ title_url: postTitle });
    const postTagIds = post.tags.map((tagId) => tagId.toString());
    const newTag = await Tag.findOne({ name: tagName });
    return !postTagIds.includes(newTag.id.toString());
  } catch (err) {
    console.error("Error in tagIsUnique:", error);
    return false;
  }
};

const tagsExist = async (tagsArray) => {
  const tagPromises = tagsArray.map(async (tagName) => {
    return await Tag.findOne({ name: tagName });
  });
  const tags = await Promise.all(tagPromises);

  if (tags.some((tag) => !tag)) {
    throw new Error("Provided tag does not exist");
  }
};

const tagExists = async (tagName) => {
  const tag = await Tag.findOne({ name: tagName });
  if (!tag) {
    throw new Error("Provided tag does not exist");
  }
};

const createPostSchema = {
  title: {
    trim: true,
    notEmpty: {
      errorMessage: "Post title should not be empty.",
    },
  },
  body: {
    trim: true,
    notEmpty: {
      errorMessage: "Post content should not be empty.",
    },
  },
  title_url: {
    notEmpty: {
      errorMessage: "title_url is required.",
    },
  },
  tags: {
    tagsExist: {
      custom: tagsExist,
    },
    optional: true,
  },
  tag: {
    tagExists: {
      custom: tagExists,
    },
    optional: true,
  },
};

const updatePostSchema = {
  title: {
    trim: true,
    notEmpty: { errorMessage: "Post subject should not be empty." },
    optional: true,
  },
  body: {
    trim: true,
    notEmpty: { errorMessage: "Post content should not be empty." },
    optional: true,
  },
  isPublished: {
    isBoolean: { errorMessage: "isPublished must be a boolean." },
    optional: true,
  },
  isDeleted: {
    isBoolean: { errorMessage: "isDeleted must be a boolean." },
    optional: true,
  },
  title_url: {
    notEmpty: { errorMessage: "title_url is required." },
    optional: true,
  },
  tags: {
    tagsExist: {
      custom: tagsExist,
    },
    optional: true,
  },
  tag: {
    tagExists: {
      custom: tagExists,
    },
    tagIsUnique: {
      custom: async (tagName, { req }) => {
        const { postTitle } = req.params;
        const isUnique = await tagIsUnique(postTitle, tagName);
        if (!isUnique) {
          throw new Error("Tag already exists in the post");
        }
        return true;
      },
    },
    optional: true,
  },
};

const validatePostCreate = checkSchema(createPostSchema, ["body"]);
const validatePostUpdate = checkSchema(updatePostSchema, ["body"]);

module.exports = { validatePostCreate, validatePostUpdate };
