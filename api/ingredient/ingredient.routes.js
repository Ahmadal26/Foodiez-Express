const express = require("express");
const routers = express.Router();
const Ingredient = require("../../models/Category");
const uploader = require("../../middlewares/uploder");
const {
  getAllIngredient,
  ingredientCreate,
  getByIngredientId,
  ingredientUpdateById,
  ingredientDelete,
} = require("./ingredient.controller");

const passport = require("passport");
routers.param("ingredientId", async (req, res, next, ingredientId) => {
  try {
    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      res.status(404).json(message.error);
    }
    req.ingredient = ingredients;
    next();
  } catch (error) {
    next(error);
  }
});

routers.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllIngredient
);
routers.post(
  "/",
  uploader.single("image"),
  passport.authenticate("jwt", { session: false }),
  ingredientCreate
);
routers.get("/:ingredientId", getByIngredientId);
routers.delete("/:ingredientId", ingredientDelete);
routers.put(
  "/:ingredientId",
  passport.authenticate("jwt", { session: false }),
  ingredientUpdateById
);
module.exports = routers;
