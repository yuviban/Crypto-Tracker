import React, { useState } from "react";
import AlertModal from "./AlertModal";
import "../styles/CoinCard.css";

const CoinCard = ({ coin }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="coin-card">
      <img src={coin.icon} alt={coin.symbol} />
      <h3>{coin.symbol}</h3>
      <p>${coin.price.toFixed(3)}</p>
      <button onClick={() => setShowModal(true)}>Set Alert</button>
      {showModal && <AlertModal coin={coin} closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default CoinCard;
