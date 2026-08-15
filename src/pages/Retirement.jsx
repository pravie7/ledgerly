import { useMemo, useState } from "react";

export default function Retirement() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentCorpus, setCurrentCorpus] = useState(1000000);
  const [inflation, setInflation] = useState(6);
  const [returnRate, setReturnRate] = useState(12);

  const yearsLeft = Math.max(retirementAge - currentAge, 0);

  const futureExpense = useMemo(() => {
    return monthlyExpense * Math.pow(1 + inflation / 100, yearsLeft);
  }, [monthlyExpense, inflation, yearsLeft]);

  const requiredCorpus = useMemo(() => {
    return futureExpense * 12 * 25;
  }, [futureExpense]);

  const monthlyInvestment = useMemo(() => {
    if (yearsLeft === 0) return 0;

    const r = returnRate / 1200;
    const n = yearsLeft * 12;

    const fvNeeded = Math.max(requiredCorpus - currentCorpus * Math.pow(1 + r, n), 0);

    if (r === 0) return Math.round(fvNeeded / n);

    const sip =
      fvNeeded /
      ((Math.pow(1 + r, n) - 1) / r);

    return Math.round(sip);
  }, [requiredCorpus, currentCorpus, returnRate, yearsLeft]);

  const projection = useMemo(() => {
    const arr = [];
    let corpus = currentCorpus;
    const annualInvest = monthlyInvestment * 12;

    for (let i = 0; i <= yearsLeft; i++) {
      arr.push({
        age: currentAge + i,
        corpus: Math.round(corpus),
      });

      corpus = corpus * (1 + returnRate / 100) + annualInvest;
    }

    return arr;
  }, [currentAge, yearsLeft, currentCorpus, returnRate, monthlyInvestment]);

  const maxCorpus = Math.max(...projection.map((p) => p.corpus), 1);

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <small>Years Left</small>
          <h2>{yearsLeft}</h2>
        </div>

        <div className="card">
          <small>Future Monthly Expense</small>
          <h2>₹{Math.round(futureExpense).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Required Corpus</small>
          <h2>₹{Math.round(requiredCorpus).toLocaleString()}</h2>
        </div>

        <div className="card">
          <small>Required SIP</small>
          <h2>₹{monthlyInvestment.toLocaleString()}</h2>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>FIRE Calculator</h2>

          <div className="row">
            <div>
              <label>Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Monthly Expense</label>
              <input
                type="number"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Current Corpus</label>
              <input
                type="number"
                value={currentCorpus}
                onChange={(e) => setCurrentCorpus(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label>Inflation %</label>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Expected Return %</label>
              <input
                type="number"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Retirement Summary</h2>

          <table>
            <tbody>
              <tr>
                <td>Current Age</td>
                <td>{currentAge}</td>
              </tr>

              <tr>
                <td>Retirement Age</td>
                <td>{retirementAge}</td>
              </tr>

              <tr>
                <td>Years Remaining</td>
                <td>{yearsLeft}</td>
              </tr>

              <tr>
                <td>Future Monthly Expense</td>
                <td>₹{Math.round(futureExpense).toLocaleString()}</td>
              </tr>

              <tr>
                <td>Target Corpus</td>
                <td>₹{Math.round(requiredCorpus).toLocaleString()}</td>
              </tr>

              <tr>
                <td>Monthly SIP Needed</td>
                <td>₹{monthlyInvestment.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <h2>Corpus Growth Projection</h2>

        <div
          style={{
            display: "flex",
            alignItems: "end",
            gap: 8,
            height: 220,
            marginTop: 20,
          }}
        >
          {projection.map((p) => (
            <div
              key={p.age}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "#2563EB",
                  borderRadius: 6,
                  height: `${(p.corpus / maxCorpus) * 180}px`,
                  minHeight: 6,
                }}
              />

              <small style={{ marginTop: 6 }}>{p.age}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Year-wise Projection</h2>

        <table>
          <thead>
            <tr>
              <th>Age</th>
              <th>Estimated Corpus</th>
            </tr>
          </thead>

          <tbody>
            {projection.map((p) => (
              <tr key={p.age}>
                <td>{p.age}</td>
                <td>₹{p.corpus.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
