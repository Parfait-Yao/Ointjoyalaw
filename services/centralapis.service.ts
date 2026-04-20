export interface CentralApiDepositData {
  numberClient: string;
  amount: number;
  typeService: string;
  reference: string;
}

export async function initiateCentralApiDeposit(data: CentralApiDepositData) {
  const url = "https://api.centralapis.com/api/v1/finance/deposit";
  
  const headers = {
    "Content-Type": "application/json",
    "x-app-access": process.env.CLIENT_ID || "",
    "x-app-token": process.env.CLIENT_SECRET || "",
  };

  const payload = {
    numberClient: data.numberClient,
    typeService: data.typeService, // e.g. 'MTN', 'WAVE', 'ORANGE', 'MOOV'
    amount: data.amount,
    reference: data.reference,
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetails = {};
    try {
      errorDetails = await response.json();
    } catch {}
    throw new Error(`CentralAPIs Deposit Error: ${response.status} - ${JSON.stringify(errorDetails)}`);
  }

  return response.json();
}

export async function checkCentralApiTransactionStatus(reference: string) {
  const url = `https://api.centralapis.com/api/v1/finance/status/transaction/${reference}`;
  
  const headers = {
    "Content-Type": "application/json",
    "x-app-access": process.env.CLIENT_ID || "",
    "x-app-token": process.env.CLIENT_SECRET || "",
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`CentralAPIs Status Error: ${response.status}`);
  }

  return response.json();
}
