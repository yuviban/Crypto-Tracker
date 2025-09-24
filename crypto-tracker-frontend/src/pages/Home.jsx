import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CoinCard from "../components/CoinCard";
import "../styles/Home.css";
import { getCoins } from "../api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getCoins();
        setCoins(data);
      } catch (err) {
        console.error("Failed to fetch coins:", err);
      }
    };
    fetchCoins();
  }, []);


  useEffect(() => {

    socket.on("priceUpdate", ({ symbol, price }) => {
      setCoins(prev =>
        prev.map(c => (c.symbol === symbol ? { ...c, price } : c))
      );

      setSearchResults(prev =>
        prev.map(c => (c.symbol === symbol ? { ...c, price } : c))
      );
    });

    socket.on("alertTriggered", ({ symbol, price, targetPrice, condition }) => {

      const msg = `${symbol} alert triggered!\nPrice: $${price}\nCondition: ${condition} ${targetPrice}`;
      console.log(msg);
  
      alert(msg); 
    });

    return () => {
      socket.off("priceUpdate");
      socket.off("alertTriggered");
    };
  }, []);

  return (
    <div>
      <Navbar setSearchResults={setSearchResults} />
      <div className="coins-container">
        {(searchResults.length > 0 ? searchResults : coins).map(coin => (
          <CoinCard key={coin.symbol} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default Home;
