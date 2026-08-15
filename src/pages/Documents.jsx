import { useMemo, useState } from "react";
import {
  importTransactions,
  getTransactions,
} from "../services/api";

export default function Documents({
  documents,
  setDocuments,
  transactions,
  setTransactions,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);

    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase());

    return lines.slice(1).map((line) => {
      const cols = line.split(",");

      const row = {};

      headers.forEach((h, i) => {
        row[h] = (cols[i] || "").trim();
      });

      return {
        merchant:
          row.merchant ||
          row.description ||
          "Transaction",

        amount: Number(row.amount || 0),

        type:
          (row.type || "expense").toLowerCase(),

        category: row.category || "Other",

        account: row.account || "Cash",

        note: row.note || "",

        date:
          row.date ||
          new Date().toISOString().slice(0, 10),
      };
    });
  }

  async function chooseFile(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const text = await file.text();

    const rows = parseCSV(text);

    setSelectedFile(file);

    setPreview(rows);
  }

  async function handleImport() {
    if (preview.length === 0) return;

    setLoading(true);

    try {
      await importTransactions(preview);

      const latest = await getTransactions();

      setTransactions(latest);

      setDocuments([
        {
          id: crypto.randomUUID(),
          name: selectedFile.name,
          imported: preview.length,
          created_at: new Date().toISOString(),
        },
        ...documents,
      ]);

      setPreview([]);
      setSelectedFile(null);

      alert(
        `${latest.length} total transactions available`
      );
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  const totalAmount = useMemo(
    () =>
      preview.reduce(
        (s, t) => s + Number(t.amount),
        0
      ),
    [preview]
  );

  return (
    <div className="dashboard">
      <div className="panel">
        <h2>Import Bank Statement</h2>

        <p style={{ color: "#64748b" }}>
          Upload a CSV file containing bank
          transactions.
        </p>

        <br />

        <input
          type="file"
          accept=".csv"
          onChange={chooseFile}
        />

        {selectedFile && (
          <>
            <br />
            <br />

            <div
              style={{
                padding: 12,
                background: "#f8fafc",
                borderRadius: 10,
              }}
            >
              <strong>{selectedFile.name}</strong>

              <div
                style={{
                  color: "#64748b",
                  marginTop: 6,
                }}
              >
                {preview.length} transactions • ₹
                {totalAmount.toLocaleString()}
              </div>
            </div>

            <br />

            <button
              onClick={handleImport}
              disabled={loading}
            >
              {loading
                ? "Importing..."
                : `Import ${preview.length} Transactions`}
            </button>
          </>
        )}
      </div>

      <div className="panel">
        <h2>Preview</h2>

        {preview.length === 0 ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            No CSV selected.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {preview.map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.merchant}</td>
                  <td>{t.category}</td>
                  <td
                    style={{
                      color:
                        t.type === "income"
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}₹
                    {Number(
                      t.amount
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>Import History</h2>

        {documents.length === 0 ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            No imports yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Imported</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.name}</strong>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 13,
                      }}
                    >
                      {new Date(
                        d.created_at
                      ).toLocaleString("en-IN")}
                    </div>
                  </td>

                  <td>
                    {d.imported} transactions
                  </td>

                  <td
                    style={{
                      color: "#16a34a",
                      fontWeight: 600,
                    }}
                  >
                    Imported
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
