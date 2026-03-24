import { Server } from "socket.io";
import Message from "./models/messageModel.js";
import User from "./models/userModel.js";
import { sendPushNotification } from "./utils/notificationService.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("No user ID provided"));
    }
    socket.userId = userId;
    next();
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.join(socket.userId);

    const uid = socket.userId;
    if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
    onlineUsers.get(uid).add(socket.id);

    if (onlineUsers.get(uid).size === 1) {
      io.emit("userOnline", { userId: uid });
      (async () => {
        try {
          await User.findByIdAndUpdate(uid, { isOnline: true });
        } catch (err) {
          console.warn("Failed to mark user online in db", err.message);
        }
      })();
    }

    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("sendMessage", async (data) => {
      const { chatId, receiverId, content, clientId } = data;
      const senderId = socket.userId;

      try {
        const message = await Message.create({
          chatId,
          senderId,
          receiverId,
          content,
        });

        try {
          const Chat = await import("./models/chatModel.js");
          await Chat.default.findByIdAndUpdate(chatId, {
            lastMessage: message._id,
          });
        } catch (err) {
          console.warn("Failed to update chat lastMessage:", err.message);
        }

        const populatedMessage = await message.populate(
          "senderId",
          "name email",
        );

        const payload = {
          _id: populatedMessage._id,
          clientId,
          chatId,
          senderId: {
            _id: populatedMessage.senderId._id,
            name: populatedMessage.senderId.name,
            email: populatedMessage.senderId.email,
          },
          receiverId,
          content,
          createdAt: populatedMessage.createdAt,
        };

        io.to(chatId).emit("messageReceived", payload);

        io.to(receiverId).emit("messageReceived", payload);

        const sender = await User.findById(senderId).select("name");
        if (sender) {
          sendPushNotification(receiverId, sender.name, content).catch((err) =>
            console.error(
              "[SOCKET] Notification send failed:",
              err.message,
              err.code,
            ),
          );
        }
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("userTyping", (data) => {
      const { chatId, isTyping } = data;
      socket.broadcast.to(chatId).emit("userTyping", {
        userId: socket.userId,
        isTyping,
      });
    });

    socket.on("disconnect", () => {
      const uid = socket.userId;
      const set = onlineUsers.get(uid);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          onlineUsers.delete(uid);
          io.emit("userOffline", { userId: uid });
        }
      }
      if (!set || set.size === 0) {
        (async () => {
          try {
            await User.findByIdAndUpdate(uid, { isOnline: false });
          } catch (err) {
            console.warn("Failed to mark user offline in db", err.message);
          }
        })();
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

export default initializeSocket;
