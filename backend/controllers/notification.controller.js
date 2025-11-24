const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");

// 📌 Récupérer les notifications d'un utilisateur
const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const notifications = await Notification.find({ to: user._id })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  res.status(200).json({ notifications });
});

// 📌 Supprimer une notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { notificationId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    to: user._id,
  });

  if (!notification) return res.status(404).json({ error: "Notification not found" });

  res.status(200).json({ message: "Notification deleted successfully" });
});

module.exports = {
  getNotifications,
  deleteNotification,
};
