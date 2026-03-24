import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { sendPushNotification } from "../utils/notificationService.js";

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort("createdAt");
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { chatId, receiverId, content } = req.body;

    if (!chatId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: "chatId, receiverId and content are required",
      });
    }

    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      content,
    });

    try {
      import("../models/chatModel.js").then((ChatMod) => {
        ChatMod.default
          .findByIdAndUpdate(chatId, {
            lastMessage: message._id,
          })
          .catch((err) => console.warn("update lastMessage failed", err));
      });
    } catch (_) {}

    const sender = await User.findById(senderId).select("name");
    if (sender) {
      sendPushNotification(receiverId, sender.name, content).catch((err) =>
        console.error(
          "[MESSAGE] Notification send failed:",
          err.message,
          err.code,
        ),
      );
    } else {
      console.warn("[MESSAGE] Could not find sender by id:", senderId);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
