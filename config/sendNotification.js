import admin from "../config/firebase.js";

export const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      )
    };

    const response = await admin.messaging().send(message);
    return response;

  } catch (error) {
    console.error("FCM ERROR:", error);
    throw error;
  }
};
