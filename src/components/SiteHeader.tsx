import { Link } from "react-router-dom";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14 max-w-3xl mx-auto px-4">
        <Link
          to="/"
          className="text-xl font-serif font-semibold tracking-tight text-foreground"
        >
          Rhythmic Tools
        </Link>
        <nav>
          <Link
            to="/"
            className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            View Our Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
