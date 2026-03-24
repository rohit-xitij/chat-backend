import User from "../models/userModel.js";
import UserChatList from "../models/userChatListModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const me = req.user?.id;
    const users = await User.find({ _id: { $ne: me } }).select(
      "name email isOnline",
    );
    res.json({ success: true, users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addToChatList = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { targetId } = req.body;

    if (!targetId) {
      return res
        .status(400)
        .json({ success: false, message: "targetId required" });
    }

    const exists = await UserChatList.findOne({
      ownerId,
      targetUserId: targetId,
    });
    if (!exists) {
      await UserChatList.create({ ownerId, targetUserId: targetId });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getChatList = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const list = await UserChatList.find({ ownerId }).populate(
      "targetUserId",
      "name email isOnline",
    );

    res.json({ success: true, list });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const registerFCMToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "FCM token required" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: token } },
      { new: true },
    );

    res.json({ success: true, message: "FCM token registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFCMToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "FCM token required" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { fcmTokens: token } },
      { new: true },
    );

    res.json({ success: true, message: "FCM token removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
