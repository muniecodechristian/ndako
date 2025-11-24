const express = require("express");
const { getNotifications, deleteNotification } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", getNotifications);
router.delete("/:notificationId", deleteNotification);

module.exports = router; // ✅ export direct du router
