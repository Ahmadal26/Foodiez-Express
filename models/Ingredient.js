const { model, Schema } = require("mongoose");

const IngredientSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

module.exports = model("Ingredient", IngredientSchema);
