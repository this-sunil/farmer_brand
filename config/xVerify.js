import crypto from "crypto";




export const generateXVerify = (payloadBase64, endpoint,saltKey,saltIndex) => {
  const toHash = payloadBase64 + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(toHash).digest("hex");
  return `${sha256}###${saltIndex}`;
};
