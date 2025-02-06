const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/authentication");

const register = async (req, res) => {
  //   const { name, email, password } = req.body;

  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);

  //   const tempUser = { name, email, password: hashedPassword };

  //   if (!name || !email || !password) {
  //     throw new BadRequestError("Please provide name, email and password");
  //   }
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });

  console.log(user);
  if (!user) {
    throw new UnauthenticatedError(
      "user with this email address was not found"
    );
  }
  const token = user.createJWT();

  //   Check password

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   console.log(isMatch);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("please input correct password");
  }

  //   check token

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
