const Recipe = require("../../models/Recipe");
const Category = require("../../models/Category");
const Ingredient = require("../../models/Ingredient");
exports.fetchRecipe = async (recipeId, next) => {
  try {
    const recipe1 = await Recipe.findById(recipeId);
    return recipe1;
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};
exports.getAllRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.find(); //.populate("username", "type -_id");
    res.status(200).json(recipe);
  } catch (error) {
    res.status(401).json({ message: " No Recipe Found " });
  }
};

exports.getByRecipeId = async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const foundRecipe = await Recipe.findById(recipeId);
    if (!foundRecipe) {
      res.status(404).json({ message: "Recipe not found" });
    } else {
      res.status(201).json(foundRecipe);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRecipeToCategory = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res.status(401).json({
        message: "You are not Admin and not authorized to create Recipe!",
      });
    }

    if (req.file) {
      // replace to replace \\ in windows to / as used in nodejs
      req.body.image = req.file.path.replace("\\", "/");
    }
    req.body.chef = req.user._id;
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: " Error: Can not create a new Recipe", error });
  }
};

exports.recipeCreate = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    if (req.file) {
      req.body.image = `${req.file.path.replace("\\", "/")}`;
    }
    if (!req.body.image)
      return next({ status: 400, message: "no image was uploaded!" });

    if (req.body.image.length < 5) {
      req.body.image = "media/defaultImage.png";
    }
    const { categories, ingredients, ...recipeData } = req.body;

    const newRecipe = await Recipe.create(recipeData);

    await req.user.updateOne({ $push: { recipes: newRecipe._id } });
    if (Array.isArray(categories)) {
      if (categories?.length > 0) {
        for (let categoryName of categories) {
          const foundCategory = await Category.findOneAndUpdate(
            { name: categoryName.toLowerCase() },
            { $addToSet: { recipes: newRecipe._id } },
            { upsert: true, new: true }
          );
          await newRecipe.updateOne({
            $push: { categories: foundCategory._id },
          });
        }
      }
    } else {
      const foundCategory = await Category.findOneAndUpdate(
        { name: categories.toLowerCase() },
        { $addToSet: { recipes: newRecipe._id } },
        { upsert: true, new: true }
      );
      await newRecipe.updateOne({
        $push: { categories: foundCategory._id },
      });
    }

    if (Array.isArray(ingredients)) {
      if (ingredients?.length > 0) {
        for (let ingredientName of ingredients) {
          const foundIngredient = await Ingredient.findOneAndUpdate(
            { name: ingredientName.toLowerCase() },
            { $addToSet: { recipes: newRecipe._id } },
            { upsert: true, new: true }
          );
          await newRecipe.updateOne({
            $push: { ingredients: foundIngredient._id },
          });
        }
      }
    } else {
      const foundIngredient = await Ingredient.findOneAndUpdate(
        { name: ingredients.toLowerCase() },
        { $addToSet: { recipes: newRecipe._id } },
        { upsert: true, new: true }
      );
      await newRecipe.updateOne({
        $push: { ingredients: foundIngredient._id },
      });
    }

    return res.status(201).json(newRecipe);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.recipeDelete = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      res.status(401).json({
        message: "You are not Admin and not authorized to delete a Recipe!",
        error,
      });
    }
    const foundRecipe = await Recipe.findByIdAndDelete(req.body._id);

    if (!foundRecipe) {
      return res.status(404).json({ message: " Recipe not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
