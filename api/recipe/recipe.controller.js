const Recipe = require("../../models/Recipe");
const Category = require("../../models/Category");
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

exports.recipeCreate = async (req, res, next) => {
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

exports.addRecipeToCategory = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res.status(401).json({
        message:
          "You are not Admin and not authorized to add recipe to A category!",
      });
    }

    const { recipeId, categoryId } = req.params;

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const foundRecipe = await Recipe.findById(recipeId);
    if (!foundRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (foundRecipe && foundCategory) {
      await Category.findOneAndUpdate(foundCategory._id, {
        $push: { recipe: foundRecipe._id },
      });
      await Recipe.findOneAndUpdate(foundRecipe._id, {
        $push: { categories: foundCategory._id },
      });

      return res.status(204).end();
    }
  } catch (error) {
    return next(error);
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
