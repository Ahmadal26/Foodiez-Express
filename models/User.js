const { model, Schema } = require("mongoose");
// Everything with the word temp is a placeholder that you'll change in accordance with your project

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true },
    isStaff: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
