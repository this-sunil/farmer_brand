import crypto from "crypto";

const saltKey = "a12b34c56d78e90f12a34b56c78d90e1";
const saltIndex = "1";

export const generateXVerify = (payloadBase64, endpoint) => {
  const toHash = payloadBase64 + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(toHash).digest("hex");
  return `${sha256}###${saltIndex}`;
};
