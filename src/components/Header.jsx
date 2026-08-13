export default function Header({ page }) {
  return (
    <header className="topBar">
      <div>
        <div className="topBarTitle">{page}</div>

        <div className="topBarSubtitle">
          Private Personal Finance Dashboard
        </div>
      </div>

      <div className="topBarStatus">
        <span className="statusDot"></span>
        Local
      </div>
    </header>
  );
}
