// EasyPaisa (Telenor Microfinance Bank) integration helper
// Docs: EasyPaisa Open API / Instant Payment merchant guide.
// This builds a signed payload. Replace with your live store credentials.
import crypto from "crypto";

const generateHash = (data, hashKey) => {
  return crypto.createHmac("sha256", hashKey).update(data).digest("hex");
};

export const buildEasyPaisaPayload = ({ amountInRupees, orderId }) => {
  const orderRefNum = `EP${orderId}${Date.now()}`;
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

  const payload = {
    storeId: process.env.EASYPAISA_STORE_ID,
    amount: amountInRupees.toFixed(2),
    postBackURL: process.env.EASYPAISA_RETURN_URL,
    orderRefNum,
    expiryDate,
    merchantHashedReq: "",
  };

  const rawString = `${payload.amount}&${payload.storeId}&${orderRefNum}`;
  payload.merchantHashedReq = generateHash(rawString, process.env.EASYPAISA_HASH_KEY);

  return payload;
};

export const verifyEasyPaisaCallback = (params) => {
  // EasyPaisa returns success status codes like "0000" for success
  return params.status === "0000" || params.responseCode === "0000";
};
