import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./components/App";

// --- Offline-first styling ---
// These were previously pulled from remote CDNs (cdn.tailwindcss.com,
// cdnjs Font Awesome, fonts.googleapis.com) and broke the entire UI when the
// device had no network. They are now compiled/bundled locally by Vite so the
// packaged app is fully self-contained and works with airplane mode on.
import "./index.css"; // Tailwind (base/components/utilities) built at compile time
// The app only uses solid icons (fas), so bundle just the core + solid font
// instead of the full pack — keeps the offline bundle small.
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/orbitron/latin-900.css";
import "@fontsource/russo-one/latin-400.css";
import "@fontsource/share-tech-mono/latin-400.css";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);