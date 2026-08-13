import { useState } from "react";

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export default function Subscriptions({
  subscriptions,
  setSubscriptions,
  categories,
  accounts,
}) {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [group, setGroup] =
    useState("Subscriptions");
  const [cadence, setCadence] =
    useState("monthly");
  const [renewal, setRenewal] = useState("");
  const [account, setAccount] = useState("");

  function addSubscription(event) {
    event.preventDefault();

    if (!service.trim() || Number(amount) <= 0) {
      alert("Enter a service and valid amount.");
      return;
    }

    setSubscriptions([
      ...subscriptions,
      {
        id: createId(),
        service: service.trim(),
        amount: Number(amount),
        group,
        cadence,
        renewal,
        account,
        active: true,
      },
    ]);

    setService("");
    setAmount("");
    setRenewal("");
    setAccount("");
  }

  function remove(id) {
    setSubscriptions(
      subscriptions.filter(
        (item) => item.id !== id
      )
    );
  }

  return (
    <div className="pageStack">
      <section className="noticeBanner">
        <strong>Subscription tracking</strong>
        <span>
          Add confirmed subscriptions here. No sample
          subscriptions are created automatically.
        </span>
      </section>

      <form
        className="panel"
        onSubmit={addSubscription}
      >
        <div className="panelHeader">
          <div>
            <h2>Add Subscription</h2>
            <p>
              Track recurring services and renewals.
            </p>
          </div>
        </div>

        <div className="formGrid">
          <label>
            Service
            <input
              placeholder="Netflix, Spotify..."
              value={service}
              onChange={(event) =>
                setService(event.target.value)
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
            Group
            <select
              value={group}
              onChange={(event) =>
                setGroup(event.target.value)
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
              <option value="monthly">Monthly</option>
              <option value="quarterly">
                Quarterly
              </option>
              <option value="annual">Annual</option>
            </select>
          </label>

          <label>
            Next Renewal
            <input
              type="date"
              value={renewal}
              onChange={(event) =>
                setRenewal(event.target.value)
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
          + Add Subscription
        </button>
      </form>

      <section className="panel">
        <h2>Confirmed Subscriptions</h2>

        {subscriptions.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">◉</div>
            <h3>No subscriptions</h3>
            <p>
              Your subscription list is currently empty.
            </p>
          </div>
        ) : (
          <div className="listCards">
            {subscriptions.map((item) => (
              <div className="listCard" key={item.id}>
                <div>
                  <strong>{item.service}</strong>

                  <span>
                    {item.group} · {item.cadence}
                  </span>

                  {item.renewal && (
                    <span>
                      Renewal: {item.renewal}
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
