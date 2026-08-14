import { useState } from "react";

export default function Documents({
  documents = [],
  setDocuments = () => {},
}) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");

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

      return {
        id: Date.now() + index,
        date:
          obj.date ||
          obj["txn date"] ||
          obj.transactiondate ||
          "",
        merchant:
          obj.description ||
          obj.narration ||
          obj.merchant ||
          "Unknown",
        amount: Number(
          obj.amount || obj.debit || obj.credit || 0
        ),
        type:
          Number(obj.credit || 0) > 0
            ? "income"
            : "expense",
        category: "Needs review",
        account: "Bank",
        note: "",
      };
    });
  }

  function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseCSV(text);

      setRows(parsed);
      setFileName(file.name);
    };

    reader.readAsText(file);
  }

  function saveImport() {
    const imported = {
      id: Date.now(),
      name: fileName,
      uploadedAt: new Date().toISOString(),
      rows,
    };

    setDocuments([...documents, imported]);

    alert(`${rows.length} transactions imported successfully.`);

    setRows([]);
    setFileName("");
  }

  return (
    <div className="dashboard">
      <div className="panel">
        <h2>CSV Import Wizard</h2>

        <p style={{ marginBottom: 18, color: "#64748B" }}>
          Upload HDFC, ICICI, SBI or Axis bank statement in
          CSV format.
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
            style={{ marginTop: 18 }}
            onClick={saveImport}
          >
            Import Transactions
          </button>
        )}
      </div>

      <div className="panel">
        <h2>Preview</h2>

        {rows.length === 0 ? (
          <p>No CSV loaded.</p>
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
        <h2>Imported Files</h2>

        {documents.length === 0 ? (
          <p>No imported statements.</p>
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
                  {doc.rows.length} transactions
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
