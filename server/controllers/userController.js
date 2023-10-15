const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

const addUser = asyncHandler(async (req, res) => {
  const userFromBody = req.body;
  const fieldNames = Object.keys(userFromBody);

  if (fieldNames.length === 0) {
    res.status(400);
    throw new Error('Request body is empty');
  }
  const user = await User.create(userFromBody);

  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updateUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};
