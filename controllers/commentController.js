const Spot = require("../models/spotModel");
const Comment = require("../models/commentModel");

exports.createComment = async (req, res) => {
  try {
    // Find Spot with provided ID
    const spot = await Spot.findById(req.params.id);
    // Create comment
    const newComment = await Comment.create(req.body);
    // Add new comment to the found Spot comments array
    spot.comments.push(newComment);

    // Save Spot with the new comment
    await spot.save();
    res.status(200).json({
      status: "success",
      data: {
        newComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
