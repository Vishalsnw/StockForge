import React, { useState, useEffect } from "react";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import OrderForm from "./OrderForm";
import "./CommodityMarket.css";

// Dummy initial holdings for validation
const initialUserCommodities = [
  { name: "Iron Ore", qty: 22 },
  { name: "Wheat", qty: 9 },
  { name: "Oil", qty: 0 }
];

// Dummy market commodities
const marketCommodities = [
  { name: "Iron Ore" },
  { name: "Wheat" },
  { name: "Oil" }
];

export default function CommodityMarket() {
  const [buyOrders, setBuyOrders] = useState([
    { price: 120, qty: 22, name: "Iron Ore" },
    { price: 18, qty: 9, name: "Wheat" },
    { price: 72, qty: 15, name: "Oil" }
  ]);
  const [sellOrders, setSellOrders] = useState([
    { price: 122, qty: 10, name: "Iron Ore" },
    { price: 19, qty: 6, name: "Wheat" },
    { price: 73, qty: 8, name: "Oil" }
  ]);
  const [trades, setTrades] = useState([
    { time: "10:33:10", price: 120, qty: 8, name: "Iron Ore", type: "Buy" },
    { time: "10:32:55", price: 121, qty: 10, name: "Wheat", type: "Sell" }
  ]);
  const [userCommodities, setUserCommodities] = useState(initialUserCommodities);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuyOrders(orders =>
        orders.map(order => ({
          ...order,
          price: Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(3, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setSellOrders(orders =>
        orders.map(order => ({
          ...order,
          price: Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(3, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setTrades(trades => [
        {
          time: new Date().toLocaleTimeString().slice(0, 8),
          price: Math.floor(17 + Math.random() * 110),
          qty: Math.floor(4 + Math.random() * 12),
          name: ["Iron Ore", "Wheat", "Oil"][Math.floor(Math.random()*3)],
          type: Math.random() > 0.5 ? "Buy" : "Sell"
        },
        ...trades.slice(0, 19)
      ]);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  function handlePlaceOrder({ type, asset, qty, price, side }) {
    // type: "commodity", asset: name
    if (side === "Buy") {
      setBuyOrders([
        { price, qty, name: asset },
        ...buyOrders
      ]);
    } else {
      setSellOrders([
        { price, qty, name: asset },
        ...sellOrders
      ]);
      // Deduct from user holdings
      setUserCommodities(comms => comms.map(c =>
        c.name === asset ? { ...c, qty: c.qty - qty } : c
      ));
    }
  }

  return (
    <div className="commodity-market-pro">
      <h2>Commodity Exchange</h2>
      <div className="exchange-panel-grid">
        <div>
          <OrderForm
            orderType="commodity"
            assets={marketCommodities}
            userHoldings={userCommodities}
            onPlaceOrder={handlePlaceOrder}
          />
          <OrderBook
            buyOrders={buyOrders}
            sellOrders={sellOrders}
          />
        </div>
        <RecentTrades trades={trades} />
      </div>
    </div>
  );
}