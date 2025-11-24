import crypto from "crypto";


const saltKey = "MjMwMWQ1YTYtOTNhOC00YzRhLTg1ODItZDE2Mzk3OGJhZWJj";
const saltIndex = "1";

export const generateXVerify = (payloadBase64, endpoint) => {
  const toHash = payloadBase64 + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(toHash).digest("hex");
  return `${sha256}###${saltIndex}`;
};
