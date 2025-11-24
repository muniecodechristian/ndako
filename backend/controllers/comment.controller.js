import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// 📌 Récupérer les commentaires d'un post
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "pseudo  picture _id");

  res.status(200).json({ comments });
});
// 📌 Créer un commentaire
const createComment = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  const { postId } = req.params;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
  }

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({ error: "User or post not found" });
  }

  // Création du commentaire
  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // Lier le commentaire au post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // Créer une notification si ce n'est pas son propre post
  const postOwnerId = post.user || post.posterId; // selon ton modèle Post
  if (postOwnerId && postOwnerId.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: postOwnerId,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(201).json({ comment });
});

// 📌 Supprimer un commentaire
const deleteComment = asyncHandler(async (req, res) => {
  const { userId } = req.body; // l'utilisateur doit envoyer son _id
  const { commentId } = req.params;

  const user = await User.findById(userId);
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  if (comment.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "You can only delete your own comments" });
  }

  // retirer le commentaire du post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });

  // supprimer le commentaire
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({ message: "Comment deleted successfully" });
});
export { getComments, createComment, deleteComment };

