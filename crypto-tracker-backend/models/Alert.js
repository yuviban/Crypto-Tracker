const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  condition: { type: String, enum: ["gt", "lt"], required: true },
  targetPrice: { type: Number, required: true },
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", AlertSchema);
