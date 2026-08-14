import { useMemo, useState } from "react";

export default function Portfolio({ portfolio, setPortfolio }) {
  const data = portfolio || {
    holdings: [],
    fixedDeposits: [],
  };

  const [stock, setStock] = useState({
    name: "",
    units: "",
    buyPrice: "",
    currentPrice: "",
  });

  const [fd, setFd] = useState({
    bank: "",
    principal: "",
    maturity: "",
    rate: "",
  });

  const holdings = data.holdings || [];
  const fixedDeposits = data.fixedDeposits || [];

  const equityValue = useMemo(
    () =>
      holdings.reduce(
        (sum, h) => sum + Number(h.units) * Number(h.currentPrice),
        0
      ),
    [holdings]
  );

  const investedValue = useMemo(
    () =>
      holdings.reduce(
        (sum, h) => sum + Number(h.units) * Number(h.buyPrice),
        0
      ),
    [holdings]
  );

  const fdValue = useMemo(
    () =>
      fixedDeposits.reduce((sum, f) => sum + Number(f.principal), 0),
    [fixedDeposits]
  );

  const totalValue = equityValue + fdValue;
  const totalGain = equityValue - investedValue;

  function addHolding() {
    if (!stock.name || !stock.units) return;

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
      maturity: "",
      rate: "",
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
      fixedDeposits: fixedDeposits.filter((f) => f.id !== id),
    });
  }

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Total Portfolio</small>
          <h2>₹{totalValue.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Invested</small>
          <h2>₹{investedValue.toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Profit / Loss</small>
          <h2
            style={{
              color: totalGain >= 0 ? "#16A34A" : "#DC2626",
            }}
          >
            ₹{totalGain.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <small>Fixed Deposits</small>
          <h2>₹{fdValue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Add Stock / SIP</h2>

          <input
            placeholder="Fund / Stock Name"
            value={stock.name}
            onChange={(e) =>
              setStock({ ...stock, name: e.target.value })
            }
          />

          <div className="row">
            <input
              type="number"
              placeholder="Units"
              value={stock.units}
              onChange={(e) =>
                setStock({ ...stock, units: e.target.value })
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
              setFd({ ...fd, bank: e.target.value })
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
              placeholder="Rate %"
              value={fd.rate}
              onChange={(e) =>
                setFd({ ...fd, rate: e.target.value })
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

      <div className="panel">
        <h2>Portfolio Holdings</h2>

        {holdings.length === 0 ? (
          <p>No holdings added.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Units</th>
                <th>Current Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.units}</td>
                  <td>
                    ₹
                    {(
                      Number(h.units) *
                      Number(h.currentPrice)
                    ).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => removeHolding(h.id)}
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
                    ₹{Number(f.principal).toLocaleString()}
                  </td>
                  <td>{f.rate}%</td>
                  <td>{f.maturity}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => removeFD(f.id)}
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
