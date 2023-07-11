const Ingredient = require("../../models/Ingredient");

exports.getAllIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.find(); //.populate("username", "type -_id");
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(401).json({ message: " No Ingredient Found " });
  }
};

exports.getByIngredientId = async (req, res, next) => {
  const { ingredientId } = req.params;
  try {
    const foundIngredient = await Ingredient.findById(ingredientId);
    if (!foundIngredient) {
      res.status(404).json({ message: "Ingredient not found" });
    } else {
      res.status(201).json(foundIngredient);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ingredientCreate = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      res.status(401).json({
        message: "You are not Admin and not authorized to create Ingredient!",
      });
    }

    if (req.file) {
      // replace to replace \\ in windows to / as used in nodejs
      req.body.image = req.file.path.replace("\\", "/");
    }

    const newIngredient = await Ingredient.create(req.body);
    res.status(201).json(newIngredient);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: " Error: Can not create a new Ingredient", error });
  }
};

exports.ingredientUpdateById = async (req, res, next) => {
  try {
    const foundIngredient = await Ingredient.findByIdAndUpdate(req.body._id);

    if (!foundIngredient) {
      return res.status(404).json({ message: " Ingredient not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.ingredientDelete = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      res.status(401).json({
        message: "You are not Admin and not authorized to delete a Ingredient!",
        error,
      });
    }
    const foundIngredient = await Ingredient.findByIdAndDelete(req.body._id);

    if (!foundIngredient) {
      return res.status(404).json({ message: " Ingredient not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
