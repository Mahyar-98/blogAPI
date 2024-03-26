const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    isApproved: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", CommentSchema);
