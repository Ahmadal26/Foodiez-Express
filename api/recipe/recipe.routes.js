const express = require("express");
const routers = express.Router();
const Recipe = require("../../models/Category");
const uploader = require("../../middlewares/uploder");
const {
  getAllRecipe,
  recipeCreate,
  getByRecipeId,
  recipeUpdateById,
  recipeDelete,
} = require("./recipe.controller");

const passport = require("passport");
routers.param("recipeId", async (req, res, next, recipeId) => {
  try {
    const recipes = await Recipe.findById(recipeId);
    if (!recipes) {
      res.status(404).json(message.error);
    }
    req.recipe = recipes;
    next();
  } catch (error) {
    next(error);
  }
});

routers.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllRecipe
);
routers.post(
  "/",
  uploader.single("image"),
  passport.authenticate("jwt", { session: false }),
  recipeCreate
);
routers.get("/:recipeId", getByRecipeId);
routers.delete("/:recipeId", recipeDelete);
routers.put(
  "/:recipeId",
  passport.authenticate("jwt", { session: false }),
  recipeUpdateById
);
module.exports = routers;
