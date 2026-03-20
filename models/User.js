const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  codigo: String,
  role: { type: String, default: "user" }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);