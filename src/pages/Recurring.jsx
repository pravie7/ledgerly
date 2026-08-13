import { useState } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export default function Recurring({
  recurring,
  setRecurring,
  categories,
  accounts,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("Utilities");
  const [cadence, setCadence] =
    useState("monthly");
  const [nextDate, setNextDate] = useState("");
  const [account, setAccount] = useState("");

  function addRecurring(event) {
    event.preventDefault();

    if (!name.trim() || Number(amount) <= 0) {
      alert("Enter a name and valid amount.");
      return;
    }

    setRecurring([
      ...recurring,
      {
        id: createId(),
        name: name.trim(),
        amount: Number(amount),
        category,
        cadence,
        nextDate,
        account,
        active: true,
      },
    ]);

    setName("");
    setAmount("");
    setNextDate("");
    setAccount("");
  }

  function remove(id) {
    setRecurring(
      recurring.filter((item) => item.id !== id)
    );
  }

  return (
    <div className="pageStack">
      <section className="noticeBanner">
        <strong>Active detection</strong>
        <span>
          Manual recurring payments are supported.
          Automatic pattern detection can be connected
          to the server data layer.
        </span>
      </section>

      <form
        className="panel"
        onSubmit={addRecurring}
      >
        <div className="panelHeader">
          <div>
            <h2>Add Recurring Payment</h2>
            <p>
              Record a recurring financial commitment.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Name
            <input
              placeholder="Rent, Internet..."
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Cadence
            <select
              value={cadence}
              onChange={(event) =>
                setCadence(event.target.value)
              }
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">
                Biweekly
              </option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">
                Quarterly
              </option>
              <option value="annual">Annual</option>
            </select>
          </label>

          <label>
            Next Date
            <input
              type="date"
              value={nextDate}
              onChange={(event) =>
                setNextDate(event.target.value)
              }
            />
          </label>

          <label>
            Account
            <select
              value={account}
              onChange={(event) =>
                setAccount(event.target.value)
              }
            >
              <option value="">No account</option>
              {accounts.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <button className="primaryButton">
          + Add Recurring Payment
        </button>
      </form>

      <section className="panel">
        <h2>Confirmed Recurring Payments</h2>

        {recurring.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">↻</div>
            <h3>No recurring payments</h3>
            <p>
              Nothing has been added or confirmed yet.
            </p>
          </div>
        ) : (
          <div className="listCards">
            {recurring.map((item) => (
              <div className="listCard" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.category} · {item.cadence}
                  </span>
                  {item.nextDate && (
                    <span>
                      Next: {item.nextDate}
                    </span>
                  )}
                </div>

                <div className="listCardRight">
                  <strong>
                    ₹{item.amount.toLocaleString("en-IN")}
                  </strong>

                  <button
                    className="dangerButton smallButton"
                    onClick={() => remove(item.id)}
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
