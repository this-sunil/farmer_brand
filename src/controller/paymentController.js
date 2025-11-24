import axios from "axios";
import { generateXVerify } from "../../config/xVerify.js";

// TODO: generate phone pe transaction 





const merchantId = "M23Q1F4U5GOWS";
const phonePeBaseUrl = "https://api-preprod.phonepe.com/apis/hermes";

import crypto from "crypto";
import axios from "axios";

const SALT_KEY = "YOUR_SANDBOX_SALT_KEY";
const KEY_INDEX = 1;

const generateXVerify = (payloadBase64, path) => {
  const toHash = payloadBase64 + path + SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(toHash).digest("hex");
  return `${sha256}###${KEY_INDEX}`;
};

export const createPayment = async (req, res) => {
  try {
    const { amount, userId, mobileNumber } = req.body;

    if (!amount || !userId || !mobileNumber)
      return res.status(400).json({ success: false, msg: "Missing fields" });

    const transactionId = `TXN_${Date.now()}`;

    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectMode: "REDIRECT",
      redirectUrl: "https://farmer-brand.vercel.app/",
      callbackUrl: "https://farmer-brand.vercel.app/",
      mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");

    const xVerify = generateXVerify(payloadBase64, "/pg/v1/pay");
    console.log("X-VERIFY =>", xVerify);

    const response = await axios.post(
      `${phonePeBaseUrl}/pg/v1/pay`,
      { request: payloadBase64 },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      payloadBase64,
      xVerify,
      phonepe: response.data,
    });

  } catch (err) {
    console.error("PHONEPE ERROR:", err?.response?.data || err);
    res.status(500).json({ success: false, error: err.message });
  }
};




// TODO:check payment status
export const checkPaymentStatus = async (req, res) => {
  try {
    const txnId = req.params.transactionId;

    const endpoint = `/pg/v1/status/${merchantId}/${txnId}`;
    const xVerify = generateXVerify("", endpoint);

    const resp = await axios.get(`${phonePeBaseUrl}${endpoint}`, {
      headers: {
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": merchantId
      }
    });

    res.status(200).json({
      status:true,
      result:resp.data
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// TODO:callback handler

export const phonePeCallback = (req, res) => {
  console.log(" CALLBACK RECEIVED FROM PHONEPE:", req.body);
  res.status(200).send("Callback received");
};
