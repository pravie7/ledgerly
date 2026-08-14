export function parseCSV(text) {
  const lines = text.trim().split("\n");

  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const cols = line.split(",");

    const obj = {};

    headers.forEach((h, i) => {
      obj[h] = cols[i]?.trim() || "";
    });

    return obj;
  });
}

export function normalizeTransaction(row, rules = []) {
  const merchant =
    row.merchant ||
    row.description ||
    row.narration ||
    "Unknown";

  const credit = Number(row.credit || 0);
  const debit = Number(row.debit || 0);

  const type = credit > 0 ? "income" : "expense";
  const amount = credit || debit;

  let category = "Other";

  const matched = rules.find((r) =>
    merchant.toLowerCase().includes(r.merchant.toLowerCase())
  );

  if (matched) category = matched.category;

  return {
    id: crypto.randomUUID(),
    merchant,
    amount,
    type,
    category,
    account: "Bank",
    note: "",
    date: row.date || row.txndate || "",
  };
}

export function removeDuplicates(existing, imported) {
  return imported.filter((item) => {
    return !existing.some(
      (e) =>
        e.date === item.date &&
        e.amount === item.amount &&
        e.merchant === item.merchant
    );
  });
}
