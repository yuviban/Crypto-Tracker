# Crypto Tracker App

A real-time cryptocurrency price tracker and alert system built with **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **React.js**. Users can view live prices, set alerts for specific coins, and receive instant notifications when target prices are reached.

---

## Features

* Fetch default popular cryptocurrencies with live prices (BTC, ETH, DOGE, XRP, ADA, etc.).
* Real-time price updates using **Binance WebSocket** and **Socket.IO**.
* Set custom alerts with conditions (greater than / less than target price).
* Alerts are saved in MongoDB and emitted in real-time to the frontend.
* Delete existing alerts.

---

## Tech Stack

* **Backend:** Node.js, Express, MongoDB, Socket.IO, Axios, WebSocket
* **Frontend:** React.js, CSS
* **Database:** MongoDB (PriceCache and Alert collections)
* **External APIs:** Binance WebSocket for live prices, CoinGecko for coin icons

---

## Backend Setup

1. Clone the repo

   ```bash
   git clone <your-repo-url>
   cd crypto-tracker
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file with:

   ```
   MONGO_URI=<your-mongodb-uri>
   PORT=5000
   ```

4. Start the backend

   ```bash
   node index.js
   ```

---

## Frontend Setup

1. Navigate to the frontend folder (if separate)

   ```bash
   cd frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start React app

   ```bash
   npm start
   ```

---

## API Endpoints for Testing

### 1. Get default coins

* **URL:** `http://localhost:5000/coins`
* **Method:** `GET`
* **Description:** Fetch default popular coins with live price and icon.

---

### 2. Get all alerts

* **URL:** `http://localhost:5000/alerts`
* **Method:** `GET`
* **Description:** Fetch all alerts from the database.

---

### 3. Create an alert

* **URL:** `http://localhost:5000/alerts`
* **Method:** `POST`
* **Description:** Create a new price alert.
* **Request Body:**

```json
{
  "symbol": "BTCUSDT",
  "condition": "gt",
  "targetPrice": 65000
}
```

* **Notes:**

  * `condition` can be "gt" (greater than) or "lt" (less than).
  * `targetPrice` is the price at which the alert will trigger.

---

### 4. Delete an alert

* **URL:** `http://localhost:5000/alerts/:id`
* **Method:** `DELETE`
* **Description:** Delete an alert by its MongoDB `_id`.
* **Example:** `http://localhost:5000/alerts/650c1a7f8b6e4a1234567890`

---

## Real-time Updates

* Connect to the Socket.IO server at `http://localhost:5000`.
* **Events:**

  * `priceUpdate` → Emits `{ symbol, price }` for live price changes.
  * `alertTriggered` → Emits `{ symbol, price, targetPrice, condition }` when an alert triggers.

---

## Challenges Faced & Solutions

* **Icons not showing:** Cached CoinGecko coin list and fetched icons dynamically.
* **Price not fluctuating:** Switched to Binance `!miniTicker@arr` stream for all USDT pairs.
* **Frontend crash with null price:** Added fallback check before using `.toFixed()`.
* **Alert trigger not notifying frontend:** Implemented `alertTriggered` Socket.IO event.

---

## License

This project is open-source and free to use.
