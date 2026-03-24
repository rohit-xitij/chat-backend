import express from "express";
const app = express();
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";
import chatRouter from "./router/chatRouter.js";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket.js";

connectDB();
const server = http.createServer(app);
const io = initializeSocket(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server and Socket.IO started on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please free the port or set PORT environment variable.`,
    );
  } else {
    console.error("Server error:", err);
  }
});
