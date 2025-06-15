import React, { useState, useEffect } from "react";
import { commodityOrders } from "../data/commodityOrders";

export default function CommodityMarket() {
  const [orders, setOrders] = useState([...commodityOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders([...commodityOrders]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Commodity Exchange</h1>
      <table>
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Seller</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                No commodity orders available.
              </td>
            </tr>
          )}
          {orders.map((o, i) => (
            <tr key={i}>
              <td>{o.commodity}</td>
              <td>₹{o.price.toFixed(2)}</td>
              <td>{o.qty}</td>
              <td>{o.seller}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}