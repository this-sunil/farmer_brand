import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./serviceAccount.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminMessaging = getMessaging();
