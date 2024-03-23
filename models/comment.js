const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    isApproved: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", CommentSchema);
