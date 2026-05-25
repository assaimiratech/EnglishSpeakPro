import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "react-hot-toast";

// 🔥 INIT THEME BEFORE APP LOAD
const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
})();

const savedTheme = savedUser?.theme || "light";

if (!savedUser) {
  localStorage.setItem("theme", "light");
}

document.documentElement.classList.add(savedTheme);

// 🔥 SAFE ROOT RENDER
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontSize: "14px",
            },
          }}
        />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
