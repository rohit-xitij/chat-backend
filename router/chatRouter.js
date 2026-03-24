import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getOrCreateChat,
  getChatsForUser,
  getChatById,
} from "../controller/chatController.js";
import { getMessages, sendMessage } from "../controller/messageController.js";

const chatRouter = express.Router();

chatRouter.use(auth);

chatRouter.post("/", getOrCreateChat);

chatRouter.get("/", getChatsForUser);

chatRouter.get("/:chatId/messages", getMessages);
chatRouter.post("/:chatId/messages", sendMessage);

chatRouter.get("/:chatId", getChatById);

export default chatRouter;
