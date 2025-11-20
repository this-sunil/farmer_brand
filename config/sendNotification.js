export const sendNotification=async(token, title, body, data = {}) =>{
  try {
    const message = {
      token: token,
      notification: { title, body },
      data: data
    };
    const response = await admin.messaging().send(message);

    return response;
  } catch (error) {
    throw error;
  }
}