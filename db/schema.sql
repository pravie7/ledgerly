CREATE TABLE transactions(
    id TEXT PRIMARY KEY,
    merchant TEXT,
    amount REAL,
    type TEXT,
    category TEXT,
    account TEXT,
    note TEXT,
    date TEXT,
    created_at TEXT
);

CREATE INDEX idx_date
ON transactions(date DESC);

CREATE INDEX idx_category
ON transactions(category);
