import React, { useState } from "react";
import { createAlert } from "../api";
import "../styles/AlertModal.css";

const AlertModal = ({ coin, closeModal }) => {
  const [condition, setCondition] = useState("gt");
  const [targetPrice, setTargetPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetPrice) return alert("Enter target price");

    await createAlert({
      symbol: coin.symbol,
      condition,
      targetPrice: parseFloat(targetPrice)
    });

    closeModal();
    alert("Alert created!");
  };

  return (
    <div className="alert-modal">
      <h3>Set Alert for {coin.symbol}</h3>
      <form onSubmit={handleSubmit}>
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          <option value="gt">Price Greater Than</option>
          <option value="lt">Price Less Than</option>
        </select>
        <input
          type="number"
          placeholder="Target Price"
          value={targetPrice}
          onChange={e => setTargetPrice(e.target.value)}
        />
        <div className="buttons">
          <button type="submit">Create Alert</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AlertModal;
