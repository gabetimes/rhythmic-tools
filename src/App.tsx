import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InkLayout from "@/components/InkLayout";
import ComingSoon from "./pages/ComingSoon";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import JourneyPage from "./pages/JourneyPage";
import Capture from "./pages/Capture";
import Spaces from "./pages/Spaces";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Coming Soon homepage */}
          <Route path="/" element={<ComingSoon />} />

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
