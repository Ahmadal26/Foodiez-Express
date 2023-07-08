const { model, Schema } = require("mongoose");

const RecipeSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String, unique: true, required: true },
    ingredient: { type: String, unique: true, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Recipe", RecipeSchema);
