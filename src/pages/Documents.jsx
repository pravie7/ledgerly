import { useEffect, useMemo, useState } from "react";

const documentTypes = [
  "Bank Statement",
  "Credit Card",
  "Loan",
  "Insurance",
  "Investment",
  "Tax",
  "Salary",
  "Other",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Documents() {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ledgerly_documents"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [type, setType] = useState("Bank Statement");
  const [institution, setInstitution] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      "ledgerly_documents",
      JSON.stringify(documents)
    );
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        !query ||
        String(document.name || "")
          .toLowerCase()
          .includes(query) ||
        String(document.institution || "")
          .toLowerCase()
          .includes(query) ||
        String(document.type || "")
          .toLowerCase()
          .includes(query);

      const matchesType =
        filterType === "All" ||
        document.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [documents, search, filterType]);

  const totalDocuments = documents.length;

  const totalAmount = useMemo(() => {
    return documents.reduce(
      (total, document) =>
        total + Number(document.amount || 0),
      0
    );
  }, [documents]);

  function addDocument() {
    const cleanName = name.trim();

    if (!cleanName) {
      alert("Please enter a document name.");
      return;
    }

    const duplicate = documents.some(
      (document) =>
        String(document.name || "")
          .toLowerCase() === cleanName.toLowerCase() &&
        String(document.type || "") === type
    );

    if (duplicate) {
      alert("This document already exists.");
      return;
    }

    const newDocument = {
      id: crypto.randomUUID(),
      name: cleanName,
      type,
      institution: institution.trim(),
      date,
      amount: Number(amount || 0),
      createdAt: new Date().toISOString(),
    };

    setDocuments([
      newDocument,
      ...documents,
    ]);

    setName("");
    setType("Bank Statement");
    setInstitution("");
    setDate("");
    setAmount("");
  }

  function deleteDocument(id) {
    if (!window.confirm("Delete this document record?")) {
      return;
    }

    setDocuments(
      documents.filter(
        (document) => document.id !== id
      )
    );
  }

  function clearAllDocuments() {
    if (documents.length === 0) {
      return;
    }

    if (
      !window.confirm(
        "Delete all document records? This cannot be undone."
      )
    ) {
      return;
    }

    setDocuments([]);
  }

  return (
    <div className="pageStack">
      <section className="heroSection">
        <div>
          <h1>Documents</h1>

          <p>
            Keep a simple record of your important
            financial documents.
          </p>
        </div>
      </section>

      <section className="statGrid">
        <div className="statCard">
          <span className="statLabel">
            Documents
          </span>

          <strong className="statValue">
            {totalDocuments}
          </strong>

          <span className="statHint">
            Saved document records
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Recorded Amount
          </span>

          <strong className="statValue">
            {formatCurrency(totalAmount)}
          </strong>

          <span className="statHint">
            Total amount attached to records
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Document Types
          </span>

          <strong className="statValue">
            {new Set(
              documents.map(
                (document) => document.type
              )
            ).size}
          </strong>

          <span className="statHint">
            Categories currently used
          </span>
        </div>

        <div className="statCard">
          <span className="statLabel">
            Storage
          </span>

          <strong className="statValue">
            Local
          </strong>

          <span className="statHint">
            Saved in this browser
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Add Document Record</h2>

            <p>
              Ledgerly currently stores document
              information, not uploaded files.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <div className="formField">
            <label>Document Name</label>

            <input
              type="text"
              placeholder="HDFC Bank Statement - July"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Document Type</label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              {documentTypes.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="formField">
            <label>Institution</label>

            <input
              type="text"
              placeholder="HDFC Bank"
              value={institution}
              onChange={(event) =>
                setInstitution(
                  event.target.value
                )
              }
            />
          </div>

          <div className="formField">
            <label>Document Date</label>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </div>

          <div className="formField">
            <label>Amount (Optional)</label>

            <input
              type="number"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </div>
        </div>

        <button onClick={addDocument}>
          + Add Document
        </button>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Document Records</h2>

            <p>
              Search and manage your saved financial
              document records.
            </p>
          </div>

          {documents.length > 0 && (
            <button
              className="delete"
              onClick={clearAllDocuments}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="filterBar">
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={filterType}
            onChange={(event) =>
              setFilterType(event.target.value)
            }
          >
            <option value="All">All Types</option>

            {documentTypes.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">▤</div>

            <h3>
              {documents.length === 0
                ? "No documents yet"
                : "No matching documents"}
            </h3>

            <p>
              {documents.length === 0
                ? "Add your first financial document record above."
                : "Try changing your search or filter."}
            </p>
          </div>
        ) : (
          <div className="documentList">
            {filteredDocuments.map((document) => (
              <div
                className="documentCard"
                key={document.id}
              >
                <div className="documentMain">
                  <div className="documentIcon">
                    ▤
                  </div>

                  <div>
                    <h3>
                      {document.name}
                    </h3>

                    <span className="documentMeta">
                      {document.type}

                      {document.institution
                        ? ` · ${document.institution}`
                        : ""}

                      {document.date
                        ? ` · ${formatDate(
                            document.date
                          )}`
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="documentRight">
                  <strong>
                    {formatCurrency(
                      document.amount
                    )}
                  </strong>

                  <button
                    className="delete"
                    onClick={() =>
                      deleteDocument(
                        document.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
