const BASE = "";

export async function getTransactions() {
  const res = await fetch(`${BASE}/api/transactions`);
  return await res.json();
}

export async function addTransaction(tx) {
  await fetch(`${BASE}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tx),
  });
}
