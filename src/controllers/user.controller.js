const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { User } = require('../models/user.model');
const bcrypt = require("bcryptjs")


const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const newEmail = req.body.email;
  const { id } = req.user
  if (newEmail) {
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).send({ message: 'Email is already taken.' });
    }
  }

  const updateData = { ...req.body };


  const user = await userService.updateUserById(id, updateData , User);

  res.send(user);
});



const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ message: "User not found" });
  }

  const checkPassword = await bcrypt.compare(oldPassword, user.password);
  if (!checkPassword) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Invalid Old password" });
  }

  if (oldPassword === newPassword) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "New password cannot be the same as the old password" });
  }
  const hashPassword = await bcrypt.hash(newPassword, 8);

  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    $set: { password: hashPassword },
  }, { new: true });

  if (!updatedUser) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Failed to change password" });
  }

  res.status(httpStatus.OK).send({ message: "Password changed successfully" });
});



module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword
};
