const express = require("express");
const routers = express.Router();
const Categories = require("../../models/Category");
const uploader = require("../../middlewares/uploder");
const {
  getAllCategory,
  categoryCreate,
  getByCategoryId,
  categoryUpdateById,
  categoryDelete,
} = require("./category.controllers");

const passport = require("passport");
routers.param("categoryId", async (req, res, next, categoryId) => {
  try {
    const categories = await Categories.findById(categoryId);
    if (!categories) {
      res.status(404).json(message.error);
    }
    req.category = categories;
    next();
  } catch (error) {
    next(error);
  }
});

routers.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllCategory
);
routers.post(
  "/",
  uploader.single("image"),
  passport.authenticate("jwt", { session: false }),
  categoryCreate
);
routers.get("/:categoryId", getByCategoryId);
routers.delete("/:categoryId", categoryDelete);
routers.put(
  "/:categoryId",
  passport.authenticate("jwt", { session: false }),
  categoryUpdateById
);
module.exports = routers;
