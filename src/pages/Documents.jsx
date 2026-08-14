import { useMemo, useState } from "react";

const types = [
  "Receipt",
  "Invoice",
  "Bank Statement",
  "Insurance",
  "Warranty",
  "Tax Document",
  "ID Proof",
  "Other",
];

export default function Documents({
  documents,
  setDocuments,
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Receipt");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      return (
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [documents, search]);

  function uploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const item = {
        id: crypto.randomUUID(),
        title: title || file.name,
        type,
        name: file.name,
        size: Math.round(file.size / 1024),
        uploaded: new Date().toISOString().slice(0, 10),
        data: reader.result,
      };

      setDocuments([item, ...documents]);

      setTitle("");
      setType("Receipt");
    };

    reader.readAsDataURL(file);
  }

  function remove(id) {
    if (!confirm("Delete document?")) return;
    setDocuments(documents.filter((d) => d.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Documents</small>
          <h2>{documents.length}</h2>
        </div>

        <div className="card">
          <small>Receipts</small>
          <h2>
            {
              documents.filter((d) => d.type === "Receipt").length
            }
          </h2>
        </div>

        <div className="card">
          <small>Invoices</small>
          <h2>
            {
              documents.filter((d) => d.type === "Invoice").length
            }
          </h2>
        </div>

        <div className="card">
          <small>Bank Statements</small>
          <h2>
            {
              documents.filter(
                (d) => d.type === "Bank Statement"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="panel">
        <h2>Upload Document</h2>

        <input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="row">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="file"
            accept=".pdf,image/*"
            onChange={uploadFile}
          />
        </div>

        <small style={{ color: "#6B7280" }}>
          Supported: PDF, JPG, PNG
        </small>
      </div>

      <div className="panel">
        <div className="row">
          <input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Size</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.title}</strong>
                    <div className="txMeta">{doc.name}</div>
                  </td>

                  <td>{doc.type}</td>

                  <td>{doc.size} KB</td>

                  <td>{doc.uploaded}</td>

                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a
                        href={doc.data}
                        download={doc.name}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <button className="secondary">
                          Download
                        </button>
                      </a>

                      <button
                        className="delete"
                        onClick={() => remove(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
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
