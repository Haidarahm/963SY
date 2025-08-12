import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { useEffect } from "react";
import { useLocation } from "react-router";

// Create a ScrollToTop component
window.onload = function () {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
};
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // When the route changes, scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter >
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
);
