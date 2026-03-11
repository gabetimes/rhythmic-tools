import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import InkLayout from "@/components/InkLayout";
import { trackPageView } from "@/lib/analytics/web";
import SiteLayout from "@/components/SiteLayout";
import ComingSoon from "./pages/ComingSoon";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import JourneyPage from "./pages/JourneyPage";
import Capture from "./pages/Capture";
import Spaces from "./pages/Spaces";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import Shift from "./pages/Shift";

const queryClient = new QueryClient();

function AnalyticsPageTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsPageTracker />
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={
              <SiteLayout>
                <ComingSoon />
              </SiteLayout>
            }
          />

          {/* Legal pages */}
          <Route
            path="/terms"
            element={
              <SiteLayout>
                <Terms />
              </SiteLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <SiteLayout>
                <Privacy />
              </SiteLayout>
            }
          />

          {/* Ink tool routes */}
          <Route
            path="/ink"
            element={
              <InkLayout>
                <Index />
              </InkLayout>
            }
          />
          <Route
            path="/ink/exercises"
            element={
              <InkLayout>
                <Exercises />
              </InkLayout>
            }
          />
          <Route
            path="/ink/journey/:id"
            element={
              <InkLayout>
                <JourneyPage />
              </InkLayout>
            }
          />
          <Route
            path="/ink/capture"
            element={
              <InkLayout>
                <Capture />
              </InkLayout>
            }
          />
          <Route
            path="/ink/spaces"
            element={
              <InkLayout>
                <Spaces />
              </InkLayout>
            }
          />
          <Route
            path="/ink/stats"
            element={
              <InkLayout>
                <Stats />
              </InkLayout>
            }
          />
          {/* Shift tool */}
          <Route path="/shift" element={<Shift />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
