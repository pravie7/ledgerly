const API = "https://ledgerly-api.praveenmdu127.workers.dev";

const SESSION_KEY = "ledgerly_session";

/* ---------------- SESSION ---------------- */

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function userId() {
  return getSession()?.id || "";
}

/* ---------------- AUTH ---------------- */

export async function login(email, pin) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, pin }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  saveSession(data);

  return data;
}

export async function register(name, email, pin) {
  const res = await fetch(`${API}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      pin,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  saveSession(data);

  return data;
}

/* ---------------- TRANSACTIONS ---------------- */

export async function getTransactions() {
  const res = await fetch(`${API}/api/transactions`, {
    headers: {
      "x-user-id": userId(),
    },
  });

  return await res.json();
}

export async function addTransaction(tx) {
  const res = await fetch(`${API}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...tx,
      user_id: userId(),
    }),
  });

  return await res.json();
}

/* ---------------- ACCOUNTS ---------------- */

export async function getAccounts() {
  const res = await fetch(`${API}/api/accounts`, {
    headers: {
      "x-user-id": userId(),
    },
  });

  return await res.json();
}

export async function addAccount(account) {
  const res = await fetch(`${API}/api/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...account,
      user_id: userId(),
    }),
  });

  return await res.json();
}

/* ---------------- HEALTH ---------------- */

export async function health() {
  const res = await fetch(`${API}/api/health`);
  return await res.json();
}
