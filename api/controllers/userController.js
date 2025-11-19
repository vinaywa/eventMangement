const User = require("../models/User");

exports.postCreateUser = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res.json({
      success: false,
      message: "User with this email already exists",
    });

  const user = new User(req.body);
  await user.save();

  return res.json({
    success: true,
    data: user,
  });
};

exports.getUsers = async (req, res) => {
  const users = await User.find();

  return res.json({
    success: true,
    data: users,
  });
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user)
    return res.json({
      success: true,
      data: user,
    });

  return res.json({
    success: false,
    message: "User not found",
  });
};

exports.PutUpdateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (user)
    return res.json({
      success: true,
      data: user,
    });

  return res.json({
    success: false,
    message: "User not found",
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user)
    return res.json({
      success: true,
      message: "User deleted",
    });

  return res.json({
    success: false,
    message: "User not found",
  });
};
