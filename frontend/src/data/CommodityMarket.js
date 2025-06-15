import React, { useState, useEffect } from "react";
import { commodityOrders } from "../data/commodityOrders";

export default function CommodityMarket() {
  const [orders, setOrders] = useState([...commodityOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders([...commodityOrders]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="commodity-market">
      <h2>Commodity Exchange</h2>
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
          {orders.map((o,i) => (
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