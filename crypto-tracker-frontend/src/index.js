import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Navbar.css";
import "./styles/CoinCard.css";
import "./styles/AlertModal.css";
import "./styles/AlertList.css";
import "./styles/Home.css"; // optional if you added Home.css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
