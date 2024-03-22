const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, uniqque: true, required: true },
    body: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ tags: 1 });

module.exports = mongoose.model("Post", PostSchema);
