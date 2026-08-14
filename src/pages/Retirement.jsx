import { useMemo, useState } from "react";

export default function Retirement({
  retirement,
  setRetirement,
}) {
  const data = retirement || {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentSavings: 0,
    monthlyInvestment: 10000,
    expectedReturn: 12,
    inflation: 6,
    monthlyExpenseToday: 50000,
  };

  const [form, setForm] = useState(data);

  function update(key, value) {
    const updated = {
      ...form,
      [key]: Number(value),
    };
    setForm(updated);
    setRetirement(updated);
  }

  const years = form.retirementAge - form.currentAge;

  const futureValueCurrent = useMemo(() => {
    const r = form.expectedReturn / 1200;
    const n = years * 12;
    return form.currentSavings * Math.pow(1 + r, n);
  }, [form, years]);

  const futureValueSIP = useMemo(() => {
    const r = form.expectedReturn / 1200;
    const n = years * 12;

    if (r === 0) return form.monthlyInvestment * n;

    return (
      form.monthlyInvestment *
      ((Math.pow(1 + r, n) - 1) / r) *
      (1 + r)
    );
  }, [form, years]);

  const corpus = futureValueCurrent + futureValueSIP;

  const expenseAtRetirement = useMemo(() => {
    return (
      form.monthlyExpenseToday *
      Math.pow(1 + form.inflation / 100, years)
    );
  }, [form, years]);

  const requiredCorpus =
    expenseAtRetirement * 12 * 25;

  const fireProgress =
    requiredCorpus === 0
      ? 0
      : Math.min((corpus / requiredCorpus) * 100, 100);

  const retirementYears =
    form.lifeExpectancy - form.retirementAge;

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Projected Corpus</small>
          <h2>₹{Math.round(corpus).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Required Corpus</small>
          <h2>₹{Math.round(requiredCorpus).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>FIRE Progress</small>
          <h2>{fireProgress.toFixed(0)}%</h2>
        </div>

        <div className="card">
          <small>Retirement Years</small>
          <h2>{retirementYears} yrs</h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Retirement Inputs</h2>

          <div className="row">
            <div>
              <label>Current Age</label>
              <input
                type="number"
                value={form.currentAge}
                onChange={(e) =>
                  update("currentAge", e.target.value)
                }
              />
            </div>

            <div>
              <label>Retirement Age</label>
              <input
                type="number"
                value={form.retirementAge}
                onChange={(e) =>
                  update("retirementAge", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Life Expectancy</label>
              <input
                type="number"
                value={form.lifeExpectancy}
                onChange={(e) =>
                  update("lifeExpectancy", e.target.value)
                }
              />
            </div>

            <div>
              <label>Expected Return (%)</label>
              <input
                type="number"
                value={form.expectedReturn}
                onChange={(e) =>
                  update("expectedReturn", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Inflation (%)</label>
              <input
                type="number"
                value={form.inflation}
                onChange={(e) =>
                  update("inflation", e.target.value)
                }
              />
            </div>

            <div>
              <label>Current Savings</label>
              <input
                type="number"
                value={form.currentSavings}
                onChange={(e) =>
                  update("currentSavings", e.target.value)
                }
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Monthly SIP</label>
              <input
                type="number"
                value={form.monthlyInvestment}
                onChange={(e) =>
                  update(
                    "monthlyInvestment",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Monthly Expense Today</label>
              <input
                type="number"
                value={form.monthlyExpenseToday}
                onChange={(e) =>
                  update(
                    "monthlyExpenseToday",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Retirement Summary</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div className="budgetRow">
              <span>Years to Retirement</span>
              <strong>{years} yrs</strong>
            </div>

            <div className="budgetRow">
              <span>Corpus from Savings</span>
              <strong>
                ₹{Math.round(futureValueCurrent).toLocaleString()}
              </strong>
            </div>

            <div className="budgetRow">
              <span>Corpus from SIP</span>
              <strong>
                ₹{Math.round(futureValueSIP).toLocaleString()}
              </strong>
            </div>

            <div className="budgetRow">
              <span>Future Monthly Expense</span>
              <strong>
                ₹{Math.round(expenseAtRetirement).toLocaleString()}
              </strong>
            </div>

            <hr />

            <div className="budgetRow">
              <strong>Total Corpus</strong>
              <strong style={{ color: "#2563EB" }}>
                ₹{Math.round(corpus).toLocaleString()}
              </strong>
            </div>

            <div className="progress">
              <div
                style={{
                  width: `${fireProgress}%`,
                  background:
                    fireProgress >= 100
                      ? "#16A34A"
                      : "#2563EB",
                }}
              />
            </div>

            <small>
              FIRE assumes **25× annual expenses** as the
              target corpus.
            </small>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Retirement Timeline</h2>

        <table>
          <thead>
            <tr>
              <th>Age</th>
              <th>Investment</th>
              <th>Estimated Corpus</th>
            </tr>
          </thead>

          <tbody>
            {Array.from(
              { length: Math.max(0, years + 1) },
              (_, i) => {
                const age = form.currentAge + i;
                const months = i * 12;
                const r = form.expectedReturn / 1200;

                const currentFV =
                  form.currentSavings *
                  Math.pow(1 + r, months);

                const sipFV =
                  months === 0
                    ? 0
                    : form.monthlyInvestment *
                      ((Math.pow(1 + r, months) - 1) / r) *
                      (1 + r);

                const total = currentFV + sipFV;

                return (
                  <tr key={age}>
                    <td>{age}</td>
                    <td>
                      ₹
                      {(
                        form.monthlyInvestment *
                        months
                      ).toLocaleString()}
                    </td>
                    <td>
                      ₹{Math.round(total).toLocaleString()}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
