const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, unique: true, required: true },
    body: { type: String, required: true },
    isPublished: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    title_url: { type: String, unique: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
