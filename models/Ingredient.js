const { model, Schema } = require("mongoose");

const IngredientSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Ingredient", IngredientSchema);
