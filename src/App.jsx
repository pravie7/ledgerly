import { useMemo, useState } from "react";
import "./index.css";

const pages = ["Dashboard","Transactions","Budgets","Goals","Settings"];

export default function App(){

  const [page,setPage]=useState("Dashboard");

  const [transactions,setTransactions]=useState([]);

  const [merchant,setMerchant]=useState("");
  const [amount,setAmount]=useState("");
  const [type,setType]=useState("expense");
  const [category,setCategory]=useState("Shopping");

  const income = useMemo(
    ()=>transactions.filter(t=>t.type==="income").reduce((a,b)=>a+b.amount,0),
    [transactions]
  );

  const spending = useMemo(
    ()=>transactions.filter(t=>t.type==="expense").reduce((a,b)=>a+b.amount,0),
    [transactions]
  );

  const savings = income===0?0:Math.round(((income-spending)/income)*100);

  function addTransaction(){

    if(!merchant || !amount) return;

    setTransactions([
      {
        merchant,
        amount:Number(amount),
        type,
        category,
        date:new Date().toISOString().slice(0,10)
      },
      ...transactions
    ]);

    setMerchant("");
    setAmount("");
  }

  return(
    <div className="layout">

      <aside className="sidebar">

        <h2>Ledgerly</h2>

        {pages.map(p=>(
          <div
            key={p}
            className={page===p?"nav active":"nav"}
            onClick={()=>setPage(p)}
          >
            {p}
          </div>
        ))}

      </aside>

      <main className="content">

        <div className="header">
          <h1>{page}</h1>
          <p>Private Personal Finance</p>
        </div>

        {page==="Dashboard" && (

          <>
            <div className="cards">

              <Card title="Income" value={`₹${income}`} color="#16A34A"/>

              <Card title="Spending" value={`₹${spending}`} color="#EA580C"/>

              <Card title="Savings" value={`${savings}%`} color="#2563EB"/>

              <Card title="Transactions" value={transactions.length} color="#6558D3"/>

            </div>

            <div className="panel">
              <h2>Recent Activity</h2>

              {transactions.length===0?

                <p>No transactions yet.</p>

                :

                transactions.slice(0,5).map((t,i)=>(
                  <div className="tx" key={i}>
                    <div>
                      <strong>{t.merchant}</strong>
                      <br/>
                      <small>{t.date} · {t.category}</small>
                    </div>

                    <div
                      style={{
                        color:t.type==="income"?"#16A34A":"#111827",
                        fontWeight:"bold"
                      }}
                    >
                      {t.type==="income"?"+":"-"}₹{t.amount}
                    </div>

                  </div>
                ))

              }

            </div>
          </>

        )}

        {page==="Transactions" && (

          <>
            <div className="panel">

              <h2>Add Transaction</h2>

              <input
                placeholder="Merchant"
                value={merchant}
                onChange={e=>setMerchant(e.target.value)}
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={e=>setAmount(e.target.value)}
              />

              <div className="row">

                <select value={type} onChange={e=>setType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <select value={category} onChange={e=>setCategory(e.target.value)}>
                  <option>Shopping</option>
                  <option>Groceries</option>
                  <option>Dining</option>
                  <option>Transport</option>
                  <option>Utilities</option>
                </select>

              </div>

              <button onClick={addTransaction}>
                Add
              </button>

            </div>

            <div className="panel">

              <h2>All Transactions</h2>

              <table>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map((t,i)=>(

                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.merchant}</td>
                      <td>{t.category}</td>
                      <td>{t.type==="income"?"+":"-"}₹{t.amount}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          </>

        )}

        {page==="Budgets" && (
          <div className="panel">
            <h2>Budgets</h2>
            <p>Create monthly spending limits.</p>
          </div>
        )}

        {page==="Goals" && (
          <div className="panel">
            <h2>Savings Goals</h2>
            <p>Track your emergency fund and future purchases.</p>
          </div>
        )}

        {page==="Settings" && (
          <div className="panel">
            <h2>Settings</h2>
            <p>Database, Categories, Accounts and Backup.</p>
          </div>
        )}

      </main>

    </div>
  )

}

function Card({title,value,color}){

  return(
    <div className="card">

      <small>{title}</small>

      <h2 style={{color}}>
        {value}
      </h2>

    </div>
  )

}
