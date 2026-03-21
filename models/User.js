const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    codigo: String,
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);