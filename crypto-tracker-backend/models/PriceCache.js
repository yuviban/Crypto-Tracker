const mongoose = require("mongoose");

const PriceCacheSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PriceCache", PriceCacheSchema);
