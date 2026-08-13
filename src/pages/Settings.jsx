export default function Settings() {
  return (
    <div className="panel">
      <h2>Settings</h2>

      <div className="setting">
        <label>Currency</label>
        <select>
          <option>INR (₹)</option>
        </select>
      </div>

      <div className="setting">
        <label>Theme</label>
        <select>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <button>Export Backup</button>
    </div>
  );
}
