const BASE =
  "https://ledgerly-api.praveenmdu127.workers.dev";

export async function getTransactions() {
  const res = await fetch(`${BASE}/api/transactions`);

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return await res.json();
}

export async function addTransaction(transaction) {
  const res = await fetch(`${BASE}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) {
    throw new Error("Failed to save transaction");
  }

  return await res.json();
}
