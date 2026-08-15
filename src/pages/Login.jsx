import { useState } from "react";

const DEMO_USER = {
  email: "admin@ledgerly.app",
  pin: "1234",
  name: "Praveen",
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === DEMO_USER.email &&
      pin === DEMO_USER.pin
    ) {
      const session = {
        id: "user-001",
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "ledgerly_session",
        JSON.stringify(session)
      );

      onLogin(session);
      return;
    }

    setError("Invalid email or PIN");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 30px 60px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              color: "#1d4ed8",
            }}
          >
            ₹ Ledgerly
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 8,
            }}
          >
            Personal Finance OS
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="admin@ledgerly.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #CBD5E1",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              4 Digit PIN
            </label>

            <input
              type="password"
              maxLength={4}
              placeholder="1234"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, ""))
              }
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "1px solid #CBD5E1",
                letterSpacing: 8,
                textAlign: "center",
                fontSize: 22,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                color: "#DC2626",
                padding: 12,
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: 8,
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#F8FAFC",
            borderRadius: 12,
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: 8,
            }}
          >
            Demo Login
          </strong>

          <div
            style={{
              color: "#475569",
              fontSize: 14,
            }}
          >
            Email: admin@ledgerly.app
          </div>

          <div
            style={{
              color: "#475569",
              fontSize: 14,
            }}
          >
            PIN: 1234
          </div>
        </div>
      </div>
    </div>
  );
}
