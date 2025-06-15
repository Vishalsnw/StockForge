import React, { useState, useEffect } from "react";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import "./CommodityMarket.css";

// Dummy live data simulation
function useSimulatedCommodityExchange() {
  const [buyOrders, setBuyOrders] = useState([
    { price: 120, qty: 22 },
    { price: 119, qty: 40 },
    { price: 118, qty: 32 }
  ]);
  const [sellOrders, setSellOrders] = useState([
    { price: 121, qty: 18 },
    { price: 122, qty: 25 },
    { price: 123, qty: 20 }
  ]);
  const [trades, setTrades] = useState([
    { time: "10:33:10", price: 120, qty: 8, type: "Buy" },
    { time: "10:32:55", price: 121, qty: 10, type: "Sell" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuyOrders(orders =>
        orders.map(order => ({
          ...order,
          price:
            Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(3, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setSellOrders(orders =>
        orders.map(order => ({
          ...order,
          price:
            Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(3, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setTrades(trades => [
        {
          time: new Date().toLocaleTimeString().slice(0, 8),
          price: Math.floor(118 + Math.random() * 6),
          qty: Math.floor(4 + Math.random() * 12),
          type: Math.random() > 0.5 ? "Buy" : "Sell"
        },
        ...trades.slice(0, 19)
      ]);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return { buyOrders, sellOrders, trades };
}

export default function CommodityMarket() {
  const { buyOrders, sellOrders, trades } = useSimulatedCommodityExchange();

  return (
    <div className="commodity-market-pro">
      <h2>Commodity Exchange</h2>
      <div className="exchange-panel-grid">
        <OrderBook buyOrders={buyOrders} sellOrders={sellOrders} />
        <RecentTrades trades={trades} />
      </div>
    </div>
  );
}