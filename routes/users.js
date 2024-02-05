const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/session");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    secret: String,
  },
  { timestamps: true }
);

userSchema.plugin(plm); // Apply passport-local-mongoose plugin here

const User = mongoose.model("user", userSchema);

module.exports = User;
