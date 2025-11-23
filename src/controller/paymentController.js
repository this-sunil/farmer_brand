import axios from "axios";
import { generateXVerify } from "../../config/xVerify.js";

// TODO: generate phone pe transaction 
const merchantId = "PGTESTMERCHANT123";
const saltKey = "a12b34c56d78e90f12a34b56c78d90e1";
const saltIndex = "1";
const phonePeBaseUrl = "https://api-preprod.phonepe.com/apis/hermes"; // sandbox

// TODO:create payment
export const createPayment = async (req, res) => {
  try {
    const { amount, userId, mobileNumber } = req.body;
    const transactionId=Date.now();
    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectMode: "REDIRECT",
      redirectUrl: "https://your-domain.com/payment-done",
      callbackUrl: "https://your-domain.com/api/payment/callback",
      mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");

    const xVerify = generateXVerify(payloadBase64, "/pg/v1/pay");

    const phonepeResponse = await axios.post(
      `${phonePeBaseUrl}/pg/v1/pay`,
      { request: payloadBase64 },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId
        }
      }
    );

    res.json({
      success: true,
      payloadBase64,
      xVerify,
      phonepe: phonepeResponse.data
    });

  } catch (err) {
    console.log(err);
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

    res.json(resp.data);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// TODO:callback handler

export const phonePeCallback = (req, res) => {
  console.log(" CALLBACK RECEIVED FROM PHONEPE:", req.body);
  res.status(200).send("Callback received");
};
