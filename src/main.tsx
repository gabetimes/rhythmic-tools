import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { initializeWebAnalytics } from "@/lib/analytics/web";

const hour = new Date().getHours();
const defaultTheme = hour >= 17 ? "dark" : "light";

initializeWebAnalytics();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
    <App />
  </ThemeProvider>
);
