const Category = require("../../models/Category");

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find(); //.populate("username", "type -_id");
    res.status(200).json(categories);
  } catch (error) {
    res.status(401).json({ message: " No Category Found " });
  }
};

exports.getByCategoryId = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const foundCategory = await Movie.findById(categoryId);
    if (!foundCategory) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(201).json(foundCategory);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.categoryCreate = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      res.status(401).json({
        message: "You are not Admin and not authorized to create Category!",
        error,
      });
    }

    if (req.file) {
      // replace to replace \\ in windows to / as used in nodejs
      req.body.image = req.file.path.replace("\\", "/");
    }

    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: " Error: Can not create a new Category", error });
  }
};

exports.categoryUpdateById = async (req, res, next) => {
  try {
    const foundCategory = await Movie.findByIdAndUpdate(req.body._id);

    if (!foundCategory) {
      return res.status(404).json({ message: " Category not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.categoryDelete = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      res.status(401).json({
        message: "You are not Admin and not authorized to delete a category!",
        error,
      });
    }
    const foundCategory = await Movie.findByIdAndDelete(req.body._id);

    if (!foundCategory) {
      return res.status(404).json({ message: " Category not Found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// exports.categoryDelete = async (req, res, next) => {
//   try {
//     if (!req.user.isStaff)
//       return next({ status: 401, message: "You are not Admin and not authorized to delete a category!" });
//     await Actor.findByIdAndRemove({ _id: req.body.id });
//     return res.status(204).end();
//   } catch (error) {
//     return next(error);
//   }
// };
