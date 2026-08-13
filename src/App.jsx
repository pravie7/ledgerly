import { useMemo, useState } from "react";

export default function App() {
  const [tx, setTx] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Shopping");

  const income = useMemo(
    () => tx.filter(t => t.type === "income").reduce((a,b)=>a+b.amount,0),
    [tx]
  );

  const spending = useMemo(
    () => tx.filter(t => t.type === "expense").reduce((a,b)=>a+b.amount,0),
    [tx]
  );

  const savings = income === 0 ? 0 : Math.round(((income-spending)/income)*100);

  function addTransaction() {
    if (!merchant || !amount) return;

    setTx([
      {
        merchant,
        amount: Number(amount),
        type,
        category,
        date: new Date().toISOString().slice(0,10)
      },
      ...tx
    ]);

    setMerchant("");
    setAmount("");
  }

  return (
    <div style={{background:"#F5F7FB",minHeight:"100vh",padding:24,fontFamily:"Arial"}}>
      <h1 style={{color:"#6558D3",marginBottom:0}}>Ledgerly</h1>
      <p style={{color:"#666"}}>Private Personal Finance Dashboard</p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:16,
        marginTop:20
      }}>
        <Card title="Income" value={`₹${income}`} color="#16A34A"/>
        <Card title="Spending" value={`₹${spending}`} color="#EA580C"/>
        <Card title="Savings Rate" value={`${savings}%`} color="#2563EB"/>
        <Card title="Transactions" value={tx.length} color="#6558D3"/>
      </div>

      <div style={panel}>
        <h2>Add Transaction</h2>

        <input
          placeholder="Merchant"
          value={merchant}
          onChange={e=>setMerchant(e.target.value)}
          style={input}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e=>setAmount(e.target.value)}
          style={input}
        />

        <div style={{display:"flex",gap:10}}>
          <select value={type} onChange={e=>setType(e.target.value)} style={input}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select value={category} onChange={e=>setCategory(e.target.value)} style={input}>
            <option>Shopping</option>
            <option>Groceries</option>
            <option>Dining</option>
            <option>Transport</option>
            <option>Utilities</option>
          </select>
        </div>

        <button onClick={addTransaction} style={button}>
          + Add
        </button>
      </div>

      <div style={panel}>
        <h2>Recent Transactions</h2>

        {tx.length===0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table width="100%" cellPadding="10">
            <thead>
              <tr align="left">
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t,i)=>(
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.merchant}</td>
                  <td>{t.category}</td>
                  <td style={{
                    color:t.type==="income"?"#16A34A":"#111827",
                    fontWeight:"bold"
                  }}>
                    {t.type==="income"?"+":"-"}₹{t.amount}
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

function Card({title,value,color}){
  return(
    <div style={{
      background:"#fff",
      padding:18,
      borderRadius:16,
      boxShadow:"0 1px 3px rgba(0,0,0,.08)"
    }}>
      <div style={{color:"#666",fontSize:13}}>{title}</div>
      <div style={{fontSize:30,fontWeight:"bold",color}}>{value}</div>
    </div>
  )
}

const panel={
  background:"#fff",
  borderRadius:16,
  padding:20,
  marginTop:20,
  boxShadow:"0 1px 3px rgba(0,0,0,.08)"
}

const input={
  width:"100%",
  padding:12,
  borderRadius:10,
  border:"1px solid #ddd",
  marginBottom:10
}

const button={
  background:"#6558D3",
  color:"#fff",
  border:"none",
  padding:"12px 18px",
  borderRadius:10,
  cursor:"pointer",
  fontWeight:"bold"
}
