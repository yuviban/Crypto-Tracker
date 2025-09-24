import React, { useState } from "react";
import { searchCoins } from "../api";
import "../styles/Navbar.css";

const Navbar = ({ setSearchResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const results = await searchCoins(query);
    setSearchResults(results);
  };

  return (
    <nav className="navbar">
      <h2>Crypto Tracker</h2>
     
    </nav>
  );
};

export default Navbar;
