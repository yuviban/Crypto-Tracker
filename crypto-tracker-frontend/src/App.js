import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Alerts from "./pages/Alert";

const App = () => {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#0f111a", color: "white" }}>
        <Link to="/" style={{ marginRight: "20px", color: "white" }}>Home</Link>
        <Link to="/alerts" style={{ color: "white" }}>My Alerts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Router>
  );
};

export default App;
