const express = require("express");
const { createComment, getComments, deleteComment } = require("../controllers/comment.controller.js");

const router = express.Router();

// public routes
router.get("/post/:postId", getComments);

// protected routes
router.post("/post/:postId", createComment);
router.delete("/:commentId", deleteComment);

module.exports = router;
