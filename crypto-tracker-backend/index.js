require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios");
const WebSocket = require("ws");

const PriceCache = require("./models/PriceCache");
const Alert = require("./models/Alert");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Mongo DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// geting icon from coingeko
let coinListCache = [];
let iconCache = {};

async function fetchCoinList() {
  try {
    const res = await axios.get("https://api.coingecko.com/api/v3/coins/list");
    coinListCache = res.data;
    console.log("CoinGecko coin list cached:", coinListCache.length);
  } catch (err) {
    console.error("Failed to fetch CoinGecko coin list:", err.message);
  }
}
fetchCoinList();

async function getCoinIcon(symbol) {
  const upperSymbol = symbol.toUpperCase();
  if (iconCache[upperSymbol]) return iconCache[upperSymbol];

  try {
    const coinSymbol = symbol.replace("USDT", "").toLowerCase();
    const coin = coinListCache.find(c => c.symbol.toLowerCase() === coinSymbol);
    if (!coin) return "https://via.placeholder.com/64";

    const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
    const icon = res.data.image.thumb || "https://via.placeholder.com/64";
    iconCache[upperSymbol] = icon;
    return icon;
  } catch {
    return "https://via.placeholder.com/64";
  }
}

// alerts
async function checkAlerts(symbol, price) {
  const alerts = await Alert.find({ symbol, triggered: false });
  for (const alert of alerts) {
    if ((alert.condition === "gt" && price >= alert.targetPrice) ||
        (alert.condition === "lt" && price <= alert.targetPrice)) {
      alert.triggered = true;
      await alert.save();
      io.emit("alertTriggered", {
        symbol,
        price,
        targetPrice: alert.targetPrice,
        condition: alert.condition
      });
    }
  }
}


const defaultSymbols = [
  "btcusdt",   
  "ethusdt",   
  "bnbusdt",   
  "solusdt",   
  "xrpusdt",   
  "adausdt",   
  "dogeusdt",  
  "dotusdt",   
  "ltcusdt",   
  "linkusdt",  
  "uniusdt",
  "avaxusdt",  
  "shibusdt", 
  "trxusdt",   
];



const ws = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr");

ws.on("message", async (data) => {
  const tickers = JSON.parse(data); 
  for (const t of tickers) {
    const symbol = t.s; 
    const price = parseFloat(t.c);

    
    await PriceCache.findOneAndUpdate(
      { symbol },
      { price, lastUpdated: new Date() },
      { upsert: true }
    );

    io.emit("priceUpdate", { symbol, price });


    await checkAlerts(symbol, price);
  }
});

ws.on("error", (err) => console.error("Binance WebSocket error:", err.message));

// Routs

// Get default coins
app.get("/coins", async (req, res) => {
  try {
    const prices = await PriceCache.find({ symbol: { $in: defaultSymbols.map(s => s.toUpperCase()) } });
    const priceMap = {};
    prices.forEach(p => { priceMap[p.symbol] = p.price; });

    const coins = await Promise.all(defaultSymbols.map(async sym => ({
      symbol: sym.toUpperCase(),
      price: priceMap[sym.toUpperCase()] || 0,
      icon: await getCoinIcon(sym.toUpperCase())
    })));

    res.json(coins);
  } catch (err) {
    console.error("Failed /coins:", err.message);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
});

// Search coins
app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    const coinsFound = coinListCache.filter(c =>
      c.symbol.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);

    const prices = await PriceCache.find({});
    const priceMap = {};
    prices.forEach(p => { priceMap[p.symbol] = p.price; });

    const results = await Promise.all(coinsFound.map(async c => {
      const symbol = c.symbol.toUpperCase() + "USDT";
      return {
        id: c.id,
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        price: priceMap[symbol] || null,
        icon: await getCoinIcon(symbol)
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to search coins" });
  }
});

// Alerts
app.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find({});
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

app.post("/alerts", async (req, res) => {
  try {
    const { symbol, condition, targetPrice } = req.body;
    if (!symbol || !condition || !targetPrice)
      return res.status(400).json({ error: "All fields required" });

    const alert = new Alert({ symbol, condition, targetPrice });
    await alert.save();
    res.json({ message: "Alert created successfully", alert });
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// Delete alert by ID
app.delete("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Alert.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json({ message: "Alert deleted successfully", id });
  } catch (err) {
    console.error("Delete alert error:", err.message);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});


io.on("connection", socket => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
