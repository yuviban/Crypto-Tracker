import axios from "axios";

const BASE_URL = "http://localhost:5000"; // your backend URL

// Fetch top/trending coins from backend
export const getCoins = async () => {
  const res = await axios.get(`${BASE_URL}/coins`);
  return res.data;
};

// Search coins by query
export const searchCoins = async (query) => {
  const res = await axios.get(`${BASE_URL}/search?query=${query}`);
  return res.data;
};

// Fetch all alerts
export const getAlerts = async () => {
  const res = await axios.get(`${BASE_URL}/alerts`);
  return res.data;
};

// Create a new alert
export const createAlert = async (alert) => {
  const res = await axios.post(`${BASE_URL}/alerts`, alert);
  return res.data;
};

// Delete an alert
export const deleteAlert = async (id) => {
  const res = await axios.delete(`${BASE_URL}/alerts/${id}`);
  return res.data;
};
