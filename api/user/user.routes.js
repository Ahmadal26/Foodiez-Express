const express = require("express");
const {
  getUser,
  signup,
  userUpdateById,
  deleteUser,
  fetchUser,
  signin,
} = require("./user.controllers");
//const multer = require("multer");
// const uploader = require("../../middlewares/uploader");
const router = express.Router();
const passport = require("passport");
const {
  validationRules,
  validateFields,
} = require("../../middlewares/validateFields");

router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.user = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getUser);
//register - signup
router.post("/signup", validationRules(), validateFields, signup);
//signin
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
// router.put("/:userId", userUpdateById);
router.delete("/:userId", deleteUser);

module.exports = router;
