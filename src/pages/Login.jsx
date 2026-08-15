import { useState } from "react";
import { login, register } from "../services/api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user;

      if (isRegister) {
        if (pin.length !== 4) {
          throw new Error("PIN must be 4 digits");
        }

        user = await register(name, email, pin);
      } else {
        user = await login(email, pin);
      }

      onLogin(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo">
          <h1>₹ Ledgerly</h1>
          <p>Personal Finance OS</p>
        </div>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            maxLength={4}
            placeholder="4 Digit PIN"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, ""))
            }
            required
          />

          {error && <div className="loginError">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="loginSwitch">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>
                Sign In
              </span>
            </>
          ) : (
            <>
              New to Ledgerly?{" "}
              <span onClick={() => setIsRegister(true)}>
                Create Account
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
