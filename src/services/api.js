const BASE = "https://ledgerly-api.praveenmdu127.workers.dev";

// GET all transactions
export async function getTransactions() {
  const res = await fetch(`${BASE}/api/transactions`);

  if (!res.ok) throw new Error("Failed to load transactions");

  return await res.json();
}

// POST single transaction
export async function addTransaction(transaction) {
  const res = await fetch(`${BASE}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!res.ok) throw new Error("Failed to save transaction");

  return await res.json();
}

// BULK CSV IMPORT
export async function importTransactions(transactions) {
  const res = await fetch(`${BASE}/api/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactions),
  });

  if (!res.ok) throw new Error("CSV import failed");

  return await res.json();
}
