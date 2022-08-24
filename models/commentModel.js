const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please enter a comment"],
  },

  createAt: {
    type: Date,
    default: new Date().toISOString(),
  },

  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spot",
    required: [true, "Comment must belong to a spot"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Comment must belong to a user"],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name image",
  });

  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
