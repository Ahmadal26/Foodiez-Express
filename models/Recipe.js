const { model, Schema } = require("mongoose");

const RecipeSchema = new Schema(
  {
    chef: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

module.exports = model("Recipe", RecipeSchema);
