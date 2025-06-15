import React, { useState, useEffect } from "react";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import "./StockMarket.css";

// Dummy live data simulation
function useSimulatedStockExchange() {
  const [buyOrders, setBuyOrders] = useState([
    { price: 149, qty: 20 },
    { price: 148, qty: 35 },
    { price: 147, qty: 40 },
    { price: 146, qty: 30 }
  ]);
  const [sellOrders, setSellOrders] = useState([
    { price: 151, qty: 15 },
    { price: 152, qty: 25 },
    { price: 153, qty: 30 },
    { price: 154, qty: 40 }
  ]);
  const [trades, setTrades] = useState([
    { time: "10:34:12", price: 150, qty: 8, type: "Buy" },
    { time: "10:34:08", price: 151, qty: 10, type: "Sell" },
    { time: "10:33:50", price: 150, qty: 5, type: "Buy" }
  ]);

  // Simulate order book updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuyOrders(orders =>
        orders.map(order => ({
          ...order,
          price:
            Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(5, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setSellOrders(orders =>
        orders.map(order => ({
          ...order,
          price:
            Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(5, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setTrades(trades => [
        {
          time: new Date().toLocaleTimeString().slice(0, 8),
          price: Math.floor(147 + Math.random() * 8),
          qty: Math.floor(5 + Math.random() * 20),
          type: Math.random() > 0.5 ? "Buy" : "Sell"
        },
        ...trades.slice(0, 19)
      ]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return { buyOrders, sellOrders, trades };
}

export default function StockMarket() {
  const { buyOrders, sellOrders, trades } = useSimulatedStockExchange();

  return (
    <div className="stock-market-pro">
      <h2>Stock Exchange</h2>
      <div className="exchange-panel-grid">
        <OrderBook buyOrders={buyOrders} sellOrders={sellOrders} />
        <RecentTrades trades={trades} />
      </div>
    </div>
  );
}