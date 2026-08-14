const BASE = "https://ledgerly-api.praveenmdu127.workers.dev";

export async function getTransactions() {
  const res = await fetch(`${BASE}/api/transactions`);

  if (!res.ok) throw new Error("Unable to load transactions");

  return await res.json();
}

export async function addTransaction(tx) {
  const res = await fetch(`${BASE}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tx),
  });

  if (!res.ok) throw new Error("Unable to save transaction");

  return await res.json();
}

export async function importTransactions(list) {
  const results = [];

  for (const tx of list) {
    const r = await addTransaction(tx);
    results.push(r);
  }

  return results;
}
