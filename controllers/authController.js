const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Spot = require('../models/spotModel');
const Comment = require('../models/commentModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // 1) Get email & password from user
    const { email, password } = req.body;
    // 2) Check if email & password exist in the input
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please enter email and password',
      });
    }
    // 3a)Find user associated to email and...
    const foundUser = await User.findOne({ email }).select('+password');
    // 3b)Check if user exit & password is correct
    if (
      !foundUser ||
      !(await foundUser.correctPassword(password, foundUser.password))
    ) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }
    // 4) if no error, send token to client as response
    const token = signToken(foundUser.id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    // 1) Get the token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2) Check if the token exist
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Can not access this route. Please login',
      });
    }
    //  3) Verify the token
    const verifiedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // console.log(verifiedToken);
    // 4) Check if user still exist
    const currentUser = await User.findById(verifiedToken.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exist',
      });
    }

    // Grant access to protected Route
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: err,
    });
  }
};

exports.updatePassword = async (req, res) => {
  // 1) Get user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the inputed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your current password is wrong',
    });
  }
  // 3) update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Login user, send jwt
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
  });
};

exports.restrictedTo = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

exports.checkSpotOwnership = async (req, res, next) => {
  // 1) find  spot with id
  const spot = await Spot.findById(req.params.id);

  // 2) check if authenticated user owns the Spot
  if (!spot.user.id.equals(req.user._id)) {
    return res.status(401).json({
      status: 'fail',
      message:
        'This Spot does not belong to you. You are not authorize to perform this action',
    });
  }

  next();
};

exports.checkCommentOwnership = async (req, res, next) => {
  // 1) Find comment with id
  const comment = await Comment.findById(req.params.id);

  // 2) Check if authenticated user is owner of comment
  if (!comment.user._id.equals(req.user._id)) {
    return res.status(401).json({
      status: 'fail',
      message:
        'This comment does not belong to you. You are not authorized to perform this action',
    });
  }

  next();
};
