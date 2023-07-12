const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./api/user/user.routes");
const categoryRouts = require("./api/category/category.routes");
const recipeRouts = require("./api/recipe/recipe.routes");
const ingredientRouts = require("./api/ingredient/ingredient.routes");
const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const path = require("path");
app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

// Everything with the word temp is a placeholder that you'll change in accordance with your project

app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/user", userRoutes);
app.use("/category", categoryRouts);
app.use("/recipe", recipeRouts);
app.use("/ingredient", ingredientRouts);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`The application is running on ${config.PORT}`);
});
