const BASE =
  "https://ledgerly-api.praveenmdu127.workers.dev";

export async function getTransactions() {
  const res = await fetch(`${BASE}/api/transactions`);

  if (!res.ok) throw new Error("Load failed");

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

  return await res.json();
}

export async function importTransactions(rows) {
  const res = await fetch(`${BASE}/api/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) throw new Error("Import failed");

  return await res.json();
}
