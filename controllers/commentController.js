const Spot = require('../models/spotModel');
const Comment = require('../models/commentModel');

exports.getAllComments = async (req, res) => {
  try {
    // allow nested GET route on spot
    let filter = {};
    if (req.params.spotId) {
      filter = { spot: req.params.spotId };
    }
    const comments = await Comment.find(filter);

    res.status(200).json({
      status: 'success',
      result: comments.length,
      data: {
        comments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    if (!req.body.spot || !req.body.user) {
      req.body.spot = req.params.spotId;
      req.body.user = req.user.id;
    }

    const newComment = await Comment.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const foundComment = await Comment.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        foundComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
