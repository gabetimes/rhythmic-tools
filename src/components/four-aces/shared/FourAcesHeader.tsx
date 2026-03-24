import { Link, useLocation } from "react-router-dom";

export default function FourAcesHeader() {
  const location = useLocation();
  const isHistory = location.pathname === "/4aces/history";
  const isMethods = location.pathname === "/4aces/methods";

  return (
    <header className="sticky top-0 z-50 bg-4a-bg/95 backdrop-blur-sm border-b border-4a-border">
      <div className="max-w-[480px] mx-auto px-5 flex items-center justify-between h-12">
        <Link
          to="/4aces"
          className="font-4a-serif font-bold text-[15px] text-4a-text no-underline"
        >
          4 Aces
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/4aces/methods"
            className="text-[13px] font-medium font-4a-sans no-underline"
            style={{
              color: isMethods ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
            }}
          >
            Methods
          </Link>
          <Link
            to="/4aces/history"
            className="text-[13px] font-medium font-4a-sans no-underline"
            style={{
              color: isHistory ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
            }}
          >
            Decisions
          </Link>
          <Link
            to="/"
            className="text-[13px] font-medium font-4a-sans text-4a-text-sec no-underline"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
