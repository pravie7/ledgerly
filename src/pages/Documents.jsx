import { useRef } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export default function Documents({
  documents,
  setDocuments,
}) {
  const inputRef = useRef(null);

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const newDocuments = files.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "queued",
      uploadedAt: new Date().toISOString(),
    }));

    setDocuments([
      ...newDocuments,
      ...documents,
    ]);

    event.target.value = "";
  }

  function removeDocument(id) {
    setDocuments(
      documents.filter(
        (document) => document.id !== id
      )
    );
  }

  return (
    <div className="pageStack">
      <section className="documentUploadGrid">
        <div className="uploadCard">
          <div className="emptyIcon">⇧</div>

          <h2>Upload Documents</h2>

          <p>
            Upload statements, bills, receipts or other
            financial documents.
          </p>

          <button
            className="primaryButton"
            onClick={() => inputRef.current?.click()}
          >
            Choose Files
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept=".csv,.pdf,.png,.jpg,.jpeg,.xlsx,.xls"
            onChange={handleFiles}
          />
        </div>

        <div className="uploadCard">
          <div className="emptyIcon">⇄</div>

          <h2>Import Data</h2>

          <p>
            CSV imports can be connected to the
            transaction import pipeline.
          </p>

          <span className="mutedText">
            No files are imported automatically.
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Documents</h2>
            <p>
              Uploaded document metadata.
            </p>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">▤</div>
            <h3>No documents</h3>
            <p>
              Upload your first financial document.
            </p>
          </div>
        ) : (
          <div className="listCards">
            {documents.map((document) => (
              <div
                className="listCard"
                key={document.id}
              >
                <div>
                  <strong>{document.name}</strong>

                  <span>
                    {document.type || "Unknown type"}
                  </span>

                  <span>
                    Status: {document.status}
                  </span>
                </div>

                <button
                  className="dangerButton smallButton"
                  onClick={() =>
                    removeDocument(document.id)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
