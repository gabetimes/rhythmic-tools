import { Link } from "react-router-dom";

const DO_NOT_SELL_HREF =
  "mailto:admin@bonsaiapp.co?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information&body=I%20am%20a%20California%20resident%20and%20I%20am%20requesting%20that%20Rhythmic%2C%20Inc.%20%2F%20Rhythmic-tools%20opt%20me%20out%20of%20the%20sale%20or%20sharing%20of%20my%20personal%20information%20as%20defined%20under%20the%20California%20Consumer%20Privacy%20Act%20(CCPA%2FCPRA).%0A%0APlease%20use%20the%20following%20information%20to%20locate%20my%20account%3A%0A%0AEmail%20address%20associated%20with%20my%20account%3A%20%0A%0AI%20understand%20that%20this%20request%20will%20be%20processed%20within%2045%20days%20and%20that%20I%20will%20receive%20confirmation%20once%20completed.";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-sans">
          <p>&copy; {new Date().getFullYear()} Rhythmic, Inc.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href={DO_NOT_SELL_HREF}
              className="hover:text-foreground transition-colors"
            >
              Do Not Sell or Share My Personal Information
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
