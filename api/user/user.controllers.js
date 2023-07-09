const User = require("../../models/User");
const passHash = require("../../utils/auth/passhash");
const generateToken = require("../../utils/auth/generateToken");

exports.fetchUser = async (tempId, next) => {
  try {
    const user = await User.findById(tempId);
    return user;
  } catch (error) {
    return next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const temps = await User.find().select("-__v");
    return res.status(200).json(temps);
  } catch (error) {
    return next(error);
  }
};

//jwt.io/#debugger-io - decode the result token and see payload
exports.signup = async (req, res, next) => {
  try {
    // fetching the image from user
    if (req.file) {
      req.body.profileImage = `${req.file.path}`;
    }

    const { confirm_password } = req.body;
    const { password } = req.body;

    if (password !== confirm_password) {
      throw new Error("Passwords must be the same");
    }
    req.body.password = await passHash(password);

    // create user

    const newUser = await User.create(req.body);
    // generate Token
    const token = generateToken(newUser);
    // return Token
    res.status(201).json({ message: "You are Registered now!", token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.signin = async (req, res, next) => {
  try {
    console.log(req.user);
    const newUser = await User.findOne(req.user);
    const token = generateToken(newUser);
    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
};

// //7- a user can update a movie by id
exports.userUpdateById = async (req, res, next) => {
  try {
    if (!req.user.isStaff) {
      return res.status(401).json({
        message: "You are not Admin and not authorized to update a user!",
        error,
      });
    }
    const foundUser = await Movie.findByIdAndUpdate(req.body._id);

    if (!foundUser) {
      return res.status(404).json({ message: " User not Found" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndRemove({ _id: req.user.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
// exports.deleteUser = async (req, res, next) => {
//   try {
//     await User.findByIdAndRemove({ _id: req.user.id });
//     return res.status(204).end();
//   } catch (error) {
//     return next(error);
//   }
// };
// exports = async (confirmPassword, {req}) => {
//       const password = req.body.password

//       // If password and confirm password not same
//       // don't allow to sign up and throw error
//       if(password !== confirmPassword){
//         throw new Error('Passwords must be same')
//       }
//     }),
// }
