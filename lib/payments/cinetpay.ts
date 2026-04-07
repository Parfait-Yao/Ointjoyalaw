import crypto from "crypto";

export const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY!;
export const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID!;
export const CINETPAY_SECRET_KEY = process.env.CINETPAY_SECRET_KEY!;

/**
 * Génère la signature HMAC attendue par CinetPay pour valider les webhooks
 */
export function verifyCinetPaySignature(
  signature: string,
  payload: string
): boolean {
  const hmac = crypto.createHmac("sha256", CINETPAY_SECRET_KEY);
  hmac.update(payload);
  const calculatedSignature = hmac.digest("hex");
  
  return calculatedSignature === signature;
}

export interface CinetPayPaymentData {
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  customer_name: string;
  customer_email: string;
  return_url: string;
  notify_url: string;
}

/**
 * Appelle l'API CinetPay pour initialiser un paiement
 */
export async function initializeCinetPayPayment(data: CinetPayPaymentData) {
  const url = "https://api-checkout.cinetpay.com/v2/payment";
  
  const payload = {
    apikey: CINETPAY_API_KEY,
    site_id: CINETPAY_SITE_ID,
    ...data,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}
