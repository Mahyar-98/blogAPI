const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual("name").get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
