import React, { useEffect, useState } from "react";
import { getAlerts, deleteAlert } from "../api";
import "../styles/AlertList.css";

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    await deleteAlert(id);
    fetchAlerts();
  };

  return (
    <div className="alert-list">
      <h2>My Alerts</h2>
      {alerts.length === 0 && <p>No alerts set.</p>}
      {alerts.map(alert => (
        <div key={alert._id} className="alert-item">
          <p>{alert.symbol} {alert.condition === "gt" ? ">" : "<"} {alert.targetPrice}</p>
          <button onClick={() => handleDelete(alert._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AlertList;
