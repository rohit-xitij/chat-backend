import mongoose from "mongoose";

// UserChatList.find({ ownerId }).populate("targetUserId");
const userChatListSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastOpenedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Prevent duplicate sidebar entries
userChatListSchema.index({ ownerId: 1, targetUserId: 1 }, { unique: true });

const UserChatList = mongoose.model("UserChatList", userChatListSchema);

export default UserChatList;
