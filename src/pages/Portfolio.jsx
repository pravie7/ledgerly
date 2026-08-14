import { useMemo, useState } from "react";

export default function Portfolio({ portfolio, setPortfolio }) {
  const data = portfolio || {
    holdings: [],
    fixedDeposits: [],
  };

  const holdings = data.holdings || [];
  const fixedDeposits = data.fixedDeposits || [];

  const [stock, setStock] = useState({
    name: "",
    units: "",
    buyPrice: "",
    currentPrice: "",
    type: "Equity",
  });

  const [fd, setFd] = useState({
    bank: "",
    principal: "",
    rate: "",
    maturity: "",
  });

  const investedValue = useMemo(
    () =>
      holdings.reduce(
        (s, h) => s + Number(h.units) * Number(h.buyPrice),
        0
      ),
    [holdings]
  );

  const currentValue = useMemo(
    () =>
      holdings.reduce(
        (s, h) => s + Number(h.units) * Number(h.currentPrice),
        0
      ),
    [holdings]
  );

  const fdValue = useMemo(
    () =>
      fixedDeposits.reduce(
        (s, f) => s + Number(f.principal),
        0
      ),
    [fixedDeposits]
  );

  const totalPortfolio = currentValue + fdValue;
  const gain = currentValue - investedValue;

  const gainPct =
    investedValue === 0
      ? 0
      : ((gain / investedValue) * 100).toFixed(1);

  const allocation = useMemo(() => {
    const map = {};

    holdings.forEach((h) => {
      const value =
        Number(h.units) * Number(h.currentPrice);

      map[h.type] = (map[h.type] || 0) + value;
    });

    if (fdValue > 0)
      map["Fixed Deposit"] =
        (map["Fixed Deposit"] || 0) + fdValue;

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [holdings, fdValue]);

  const colors = [
    "#2563EB",
    "#16A34A",
    "#F59E0B",
    "#9333EA",
    "#DC2626",
  ];

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  function addHolding() {
    if (
      !stock.name ||
      !stock.units ||
      !stock.buyPrice ||
      !stock.currentPrice
    )
      return;

    setPortfolio({
      ...data,
      holdings: [
        ...holdings,
        {
          id: crypto.randomUUID(),
          ...stock,
        },
      ],
    });

    setStock({
      name: "",
      units: "",
      buyPrice: "",
      currentPrice: "",
      type: "Equity",
    });
  }

  function addFD() {
    if (!fd.bank || !fd.principal) return;

    setPortfolio({
      ...data,
      fixedDeposits: [
        ...fixedDeposits,
        {
          id: crypto.randomUUID(),
          ...fd,
        },
      ],
    });

    setFd({
      bank: "",
      principal: "",
      rate: "",
      maturity: "",
    });
  }

  function removeHolding(id) {
    setPortfolio({
      ...data,
      holdings: holdings.filter((h) => h.id !== id),
    });
  }

  function removeFD(id) {
    setPortfolio({
      ...data,
      fixedDeposits: fixedDeposits.filter(
        (f) => f.id !== id
      ),
    });
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Portfolio</small>
          <h2>₹{totalPortfolio.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Invested</small>
          <h2>₹{investedValue.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Gain / Loss</small>
          <h2
            style={{
              color:
                gain >= 0 ? "#16A34A" : "#DC2626",
            }}
          >
            ₹{gain.toLocaleString()}
          </h2>
          <small>{gainPct}%</small>
        </div>

        <div className="card">
          <small>Fixed Deposits</small>
          <h2>₹{fdValue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Add Holding</h2>

          <input
            placeholder="Stock / Mutual Fund"
            value={stock.name}
            onChange={(e) =>
              setStock({
                ...stock,
                name: e.target.value,
              })
            }
          />

          <select
            value={stock.type}
            onChange={(e) =>
              setStock({
                ...stock,
                type: e.target.value,
              })
            }
          >
            <option>Equity</option>
            <option>Mutual Fund</option>
            <option>Gold ETF</option>
            <option>Debt Fund</option>
          </select>

          <div className="row">
            <input
              type="number"
              placeholder="Units"
              value={stock.units}
              onChange={(e) =>
                setStock({
                  ...stock,
                  units: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Buy Price"
              value={stock.buyPrice}
              onChange={(e) =>
                setStock({
                  ...stock,
                  buyPrice: e.target.value,
                })
              }
            />
          </div>

          <input
            type="number"
            placeholder="Current Price"
            value={stock.currentPrice}
            onChange={(e) =>
              setStock({
                ...stock,
                currentPrice: e.target.value,
              })
            }
          />

          <button
            onClick={addHolding}
            style={{ marginTop: 14 }}
          >
            Add Holding
          </button>
        </div>

        <div className="panel">
          <h2>Add Fixed Deposit</h2>

          <input
            placeholder="Bank Name"
            value={fd.bank}
            onChange={(e) =>
              setFd({
                ...fd,
                bank: e.target.value,
              })
            }
          />

          <div className="row">
            <input
              type="number"
              placeholder="Principal"
              value={fd.principal}
              onChange={(e) =>
                setFd({
                  ...fd,
                  principal: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Interest %"
              value={fd.rate}
              onChange={(e) =>
                setFd({
                  ...fd,
                  rate: e.target.value,
                })
              }
            />
          </div>

          <input
            type="date"
            value={fd.maturity}
            onChange={(e) =>
              setFd({
                ...fd,
                maturity: e.target.value,
              })
            }
          />

          <button
            onClick={addFD}
            style={{ marginTop: 14 }}
          >
            Add FD
          </button>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Asset Allocation</h2>

          {allocation.length === 0 ? (
            <p>No investments yet.</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "16px 0 20px",
                }}
              >
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 140 140"
                >
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="16"
                  />

                  {allocation.map((a, i) => {
                    const pct =
                      a.value / totalPortfolio;
                    const len =
                      circumference * pct;
                    const circle = (
                      <circle
                        key={a.name}
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="16"
                        strokeDasharray={`${len} ${circumference}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    );
                    offset += len;
                    return circle;
                  })}

                  <text
                    x="70"
                    y="66"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748B"
                  >
                    Total
                  </text>
                  <text
                    x="70"
                    y="80"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    ₹{Math.round(totalPortfolio / 1000)}K
                  </text>
                </svg>
              </div>

              {allocation.map((a, i) => (
                <div
                  key={a.name}
                  className="budgetRow"
                  style={{ marginBottom: 10 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 99,
                        background:
                          colors[i % colors.length],
                      }}
                    />
                    {a.name}
                  </div>

                  <strong>
                    {(
                      (a.value / totalPortfolio) *
                      100
                    ).toFixed(0)}
                    %
                  </strong>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="panel">
          <h2>Performance</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div>
              <div className="budgetRow">
                <span>Invested</span>
                <strong>
                  ₹{investedValue.toLocaleString()}
                </strong>
              </div>

              <div className="progress">
                <div style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="budgetRow">
                <span>Current Value</span>
                <strong>
                  ₹{currentValue.toLocaleString()}
                </strong>
              </div>

              <div className="progress">
                <div
                  style={{
                    width: `${
                      investedValue === 0
                        ? 0
                        : Math.min(
                            (currentValue /
                              investedValue) *
                              100,
                            100
                          )
                    }%`,
                    background:
                      gain >= 0
                        ? "#16A34A"
                        : "#DC2626",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#F8FAFC",
              }}
            >
              <small>Total Return</small>

              <h2
                style={{
                  color:
                    gain >= 0
                      ? "#16A34A"
                      : "#DC2626",
                }}
              >
                {gainPct}%
              </h2>

              <div className="txMeta">
                Profit ₹{gain.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Portfolio Holdings</h2>

        {holdings.length === 0 ? (
          <p>No holdings added.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Units</th>
                <th>Current</th>
                <th>Gain</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {holdings.map((h) => {
                const value =
                  Number(h.units) *
                  Number(h.currentPrice);
                const invested =
                  Number(h.units) *
                  Number(h.buyPrice);
                const profit =
                  value - invested;

                return (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>{h.type}</td>
                    <td>{h.units}</td>
                    <td>
                      ₹{value.toLocaleString()}
                    </td>
                    <td
                      style={{
                        color:
                          profit >= 0
                            ? "#16A34A"
                            : "#DC2626",
                      }}
                    >
                      ₹{profit.toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="delete"
                        onClick={() =>
                          removeHolding(h.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>Fixed Deposits</h2>

        {fixedDeposits.length === 0 ? (
          <p>No Fixed Deposits.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bank</th>
                <th>Principal</th>
                <th>Rate</th>
                <th>Maturity</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {fixedDeposits.map((f) => (
                <tr key={f.id}>
                  <td>{f.bank}</td>
                  <td>
                    ₹
                    {Number(
                      f.principal
                    ).toLocaleString()}
                  </td>
                  <td>{f.rate}%</td>
                  <td>{f.maturity}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() =>
                        removeFD(f.id)
                      }
                    >
                      Delete
                    </button>
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
