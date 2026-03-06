import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

const hour = new Date().getHours();
const defaultTheme = hour >= 17 ? "dark" : "light";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
    <App />
  </ThemeProvider>
);
