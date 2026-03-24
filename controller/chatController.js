import Chat from "../models/chatModel.js";

export const getOrCreateChat = async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.body.userId;

    if (!other) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }

    let chat = await Chat.findOne({ participants: { $all: [me, other] } });
    if (!chat) {
      chat = await Chat.create({ participants: [me, other] });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all chats the authenticated user participates in
export const getChatsForUser = async (req, res) => {
  try {
    const me = req.user.id;
    const chats = await Chat.find({ participants: me }).populate(
      "participants",
      "name email",
    );
    res.json({ success: true, chats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get details for a single chat by id (including populated participants)
export const getChatById = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId).populate(
      "participants",
      "name email",
    );
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // ensure current user is a participant
    if (!chat.participants.some((u) => u._id.equals(req.user.id))) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
