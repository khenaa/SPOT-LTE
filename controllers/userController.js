const User = require("../models/userModel");

function filterObj(obj, ...allowedFields) {
  let objFilter = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      objFilter[el] = obj[el];
    }
  });

  return objFilter;
}

// UPDATE CURRENTLY LOGIN USER
exports.updateMe = async (req, res) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message:
        "This route is not for password update. Please use /updateMyPassword",
    });
  }
  // filter filed names unallowed to be updated (such 'role')
  const filteredBody = filterObj(req.body, "name", "email");
  // 2) Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
};

// DELETE CURRENTLY LOGIN USER ACCOUNT
exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// CREATE USER(restricted to admin)
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined;
    res.status(200).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// GET A PARTICULAR USER
exports.getUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        foundUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// UPDATE A USER(restricted to admin)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// DELETE A USER(restricted to admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
