const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/:id/comments", commentController.createComment);

module.exports = router;
