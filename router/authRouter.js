import express from "express";
import {
  login,
  logout,
  register,
  verify,
} from "../controller/authController.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/verify", auth, verify);

export default authRouter;
