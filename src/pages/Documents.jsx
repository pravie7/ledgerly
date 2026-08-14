import { useState } from "react";
import { importTransactions } from "../services/api";

export default function Documents({
  documents = [],
  setDocuments = () => {},
}) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  function parseCSV(text) {
    const lines = text
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase());

    return lines.slice(1).map((line, index) => {
      const values = line.split(",");

      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (values[i] || "").trim();
      });

      const debit = Number(obj.debit || 0);
      const credit = Number(obj.credit || 0);

      return {
        id: crypto.randomUUID(),
        merchant:
          obj.description ||
          obj.narration ||
          obj.merchant ||
          "Unknown",
        amount: credit > 0 ? credit : debit,
        type: credit > 0 ? "income" : "expense",
        category: "Needs review",
        account: "HDFC",
        note: "",
        date:
          obj.date ||
          obj["txn date"] ||
          new Date().toISOString().slice(0, 10),
      };
    });
  }

  function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);

      setRows(parsed);
      setFileName(file.name);
    };

    reader.readAsText(file);
  }

  async function uploadToCloud() {
    try {
      setLoading(true);

      const result = await importTransactions(rows);

      const history = {
        id: Date.now(),
        name: fileName,
        uploadedAt: new Date().toLocaleString(),
        count: result.imported,
      };

      setDocuments([...documents, history]);

      alert(
        `Imported: ${result.imported}\nDuplicates: ${result.duplicates}`
      );

      setRows([]);
      setFileName("");
    } catch (err) {
      alert("Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="panel">
        <h2>CSV Bank Statement Import</h2>

        <p style={{ color: "#64748B", marginBottom: 18 }}>
          Supports HDFC, ICICI, SBI and Axis CSV statements.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {fileName && (
          <div style={{ marginTop: 18 }}>
            <strong>{fileName}</strong>
            <p>{rows.length} transactions detected</p>
          </div>
        )}

        {rows.length > 0 && (
          <button
            onClick={uploadToCloud}
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? "Uploading..." : "Import to Cloud"}
          </button>
        )}
      </div>

      <div className="panel">
        <h2>Preview</h2>

        {rows.length === 0 ? (
          <p>No CSV selected.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {rows.slice(0, 15).map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.merchant}</td>
                  <td>₹{Number(r.amount).toLocaleString()}</td>
                  <td>{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>Import History</h2>

        {documents.length === 0 ? (
          <p>No imported files.</p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="budgetRow"
              style={{ marginBottom: 14 }}
            >
              <div>
                <strong>{doc.name}</strong>
                <div className="txMeta">
                  {doc.count} transactions • {doc.uploadedAt}
                </div>
              </div>

              <span className="badge">Imported</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
