import express from "express";

import { auth } from "../middleware/auth.js";
import {
  getAllUsers,
  addToChatList,
  getChatList,
  registerFCMToken,
  removeFCMToken,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.use(auth);

userRouter.get("/", getAllUsers);
userRouter.post("/click", addToChatList);
userRouter.get("/chat-list", getChatList);
userRouter.post("/register-fcm", registerFCMToken);
userRouter.post("/remove-fcm", removeFCMToken);

export default userRouter;
