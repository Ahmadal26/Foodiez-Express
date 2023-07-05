const jwt = require("jsonwebtoken");
const config = require("../../config/keys");

module.exports = (user) => {
  const payload = {
    username: user.username,
    _id: user._id,
    email: user.email,
  };
  // npm i jsonwebtoken - to generate a token
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_TOKEN_EXP,
  });
  return token;
};
