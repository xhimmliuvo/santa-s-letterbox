import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EnvErrorBoundary } from "./components/EnvErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <EnvErrorBoundary>
    <App />
  </EnvErrorBoundary>
);
