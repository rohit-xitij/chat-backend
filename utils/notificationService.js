import admin from "../config/firebaseConfig.js";
import User from "../models/userModel.js";

export const sendPushNotification = async (
  recipientId,
  senderName,
  messageContent,
) => {
  try {
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      console.warn(
        "[NOTIFICATION] Recipient not found in database:",
        recipientId,
      );
      return;
    }

    if (!recipient.fcmTokens || recipient.fcmTokens.length === 0) {
      console.warn("[NOTIFICATION] No FCM tokens found for user:", recipientId);
      return;
    }

    const message = {
      notification: {
        title: senderName,
        body: messageContent.substring(0, 100),
      },
      data: {
        recipientId,
        senderName,
        message: messageContent,
        timestamp: Date.now().toString(),
      },
      webpush: {
        fcmOptions: {
          link: "/chat",
        },
        notification: {
          title: senderName,
          body: messageContent.substring(0, 100),
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%234f46e5' width='192' height='192'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='120' font-weight='bold' fill='white' font-family='system-ui'>💬</text></svg>",
        },
      },
    };

    const sendPromises = recipient.fcmTokens.map((token) => {
      return admin
        .messaging()
        .send({
          ...message,
          token,
        })
        .then((response) => {
          console.log(
            "[NOTIFICATION] Successfully sent to token. Response:",
            response,
          );
          return response;
        })
        .catch((err) => {
          console.error(
            "[NOTIFICATION] Failed to send to token:",
            token.substring(0, 20) + "...",
            "Error code:",
            err.code,
            "Message:",
            err.message,
          );

          if (
            err.code === "messaging/invalid-registration-token" ||
            err.code === "messaging/registration-token-not-registered"
          ) {
            return User.findByIdAndUpdate(
              recipientId,
              { $pull: { fcmTokens: token } },
              { new: true },
            );
          }
        });
    });

    await Promise.all(sendPromises);
  } catch (error) {
    console.error(
      "[NOTIFICATION] Error sending push notification:",
      error.message,
      error.stack,
    );
  }
};
