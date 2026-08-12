export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="masthead">
      <p className="masthead__eyebrow">Wired in from JSONPlaceholder &middot; No. 04</p>
      <h1 className="masthead__title">The Daily Dispatch</h1>
      <div className="masthead__rule" />
      <p className="masthead__meta">{today} — Field reports, freshly transmitted</p>
    </header>
  );
}
