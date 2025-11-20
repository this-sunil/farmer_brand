import admin from "firebase-admin";

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(__dirname + "/../config/serviceAccount.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


export default admin;
