const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please enter a comment"],
  },

  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  createAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
