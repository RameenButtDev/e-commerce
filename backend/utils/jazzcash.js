// JazzCash Mobile Wallet integration helper
// Docs: https://sandbox.jazzcash.com.pk (Merchant Integration Guide - HTTP POST API)
// This builds the required hashed request payload. You must fill real
// merchant credentials in your .env before going live.
import crypto from "crypto";

const pad = (num, size) => String(num).padStart(size, "0");

const getTimestamps = () => {
  const now = new Date();
  const format = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}${pad(
      d.getHours(),
      2
    )}${pad(d.getMinutes(), 2)}${pad(d.getSeconds(), 2)}`;
  const txnDateTime = format(now);
  const expiry = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
  const txnExpiryDateTime = format(expiry);
  return { txnDateTime, txnExpiryDateTime };
};

// Generates the secure hash JazzCash requires (HMAC-SHA256 over sorted pp_ params)
const generateSecureHash = (params, integritySalt) => {
  const sortedKeys = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] !== undefined && params[k] !== null)
    .sort();
  const hashString = sortedKeys.map((k) => params[k]).join("&");
  const finalString = `${integritySalt}&${hashString}`;
  return crypto.createHmac("sha256", integritySalt).update(finalString).digest("hex");
};

export const buildJazzCashPayload = ({ amountInRupees, orderId, description }) => {
  const { txnDateTime, txnExpiryDateTime } = getTimestamps();
  const amount = String(Math.round(amountInRupees * 100)); // paisa, no decimals

  const baseParams = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
    pp_SubMerchantID: "",
    pp_Password: process.env.JAZZCASH_PASSWORD,
    pp_TxnRefNo: `T${orderId}${Date.now()}`,
    pp_Amount: amount,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: String(orderId),
    pp_Description: description || "Order Payment",
    pp_TxnExpiryDateTime: txnExpiryDateTime,
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
    pp_SecureHash: "",
    ppmpf_1: "1",
    ppmpf_2: "2",
    ppmpf_3: "3",
    ppmpf_4: "4",
    ppmpf_5: "5",
  };

  baseParams.pp_SecureHash = generateSecureHash(baseParams, process.env.JAZZCASH_INTEGRITY_SALT);

  return { apiUrl: process.env.JAZZCASH_API_URL, payload: baseParams };
};

export const verifyJazzCashCallback = (params) => {
  const receivedHash = params.pp_SecureHash;
  const paramsCopy = { ...params };
  delete paramsCopy.pp_SecureHash;
  const expectedHash = generateSecureHash(paramsCopy, process.env.JAZZCASH_INTEGRITY_SALT);
  return receivedHash === expectedHash && params.pp_ResponseCode === "000";
};
