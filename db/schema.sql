CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at TEXT
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  merchant TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  account TEXT,
  note TEXT,
  date TEXT,
  created_at TEXT
);

CREATE TABLE budgets (
  id TEXT PRIMARY KEY,
  category TEXT,
  limit_amount REAL
);

CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  name TEXT,
  target REAL,
  saved REAL
);

CREATE TABLE recurring (
  id TEXT PRIMARY KEY,
  merchant TEXT,
  amount REAL,
  type TEXT,
  category TEXT,
  frequency TEXT,
  day INTEGER,
  active INTEGER
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  name TEXT,
  amount REAL,
  billing TEXT,
  renewal_day INTEGER,
  active INTEGER
);

CREATE TABLE rules (
  id TEXT PRIMARY KEY,
  merchant TEXT,
  category TEXT,
  enabled INTEGER
);

CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT,
  type TEXT,
  file_name TEXT,
  uploaded TEXT
);

CREATE INDEX idx_transactions_date
ON transactions(date);

CREATE INDEX idx_transactions_category
ON transactions(category);

CREATE INDEX idx_transactions_type
ON transactions(type);
