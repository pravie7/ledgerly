export default function Header({ title = "Dashboard" }) {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="topHeader">
      <div>
        <span className="headerEyebrow">
          Personal Finance
        </span>

        <h1 className="headerTitle">
          {title}
        </h1>
      </div>

      <div className="headerMeta">
        <span className="headerPrivacy">
          Private Personal Finance
        </span>

        <span className="headerDate">
          {formattedDate}
        </span>
      </div>
    </header>
  );
}
