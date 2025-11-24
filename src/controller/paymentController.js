import axios from "axios";
import { generateXVerify } from "../../config/xVerify.js";
import { response } from "express";

// TODO: generate phone pe transaction 

// Source - https://stackoverflow.com/a
// Posted by deadcoder0904
// Retrieved 2025-11-24, License - CC BY-SA 4.0



const merchantId = process.env.PHONE_MERCHANT;
const saltKey = process.env.PHONE_SALT_KEY;
const saltIndex = process.env.PHONE_SALT_INDEX;
const phonePeBaseUrl = "https://api-preprod.phonepe.com/apis/hermes"; // sandbox

// TODO:create payment
export const createPayment = async (req, res) => {
  try {
    const { amount, userId, mobileNumber } = req.body;

    if (!amount || !userId || !mobileNumber) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const transactionId = `TXN${Date.now().toLocaleString()}`;

    const payload = {
      merchantId:merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectMode: "REDIRECT",
      redirectUrl: "https://farmer-brand.vercel.app/",
      callbackUrl: "https://farmer-brand.vercel.app/",
      mobileNumber:mobileNumber,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");

    const xVerify = generateXVerify(payloadBase64, "/pg/v1/pay",saltKey,saltIndex);
    console.log(`Verify=>${xVerify}`);
    
    const resp = await axios.post(
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

    return res.status(200).json({
      success: true,
      payloadBase64,
      xVerify,
      phonepe: resp.data,
    });
  
 


  } catch (err) {
    console.error("PHONEPE ERROR:", err?.response?.data || err);
    return res.status(500).json(err?.response?.data);
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
