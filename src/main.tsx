import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <h1 style={{ textAlign: "center", marginTop: "40vh" }}>
        Silent Watch is Live 🚀
      </h1>
    </StrictMode>
  );
}
