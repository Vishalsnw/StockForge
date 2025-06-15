import React, { useState, useEffect } from "react";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import OrderForm from "./OrderForm";
import "./StockMarket.css";

// Dummy initial holdings for validation (replace with real user state)
const initialUserStocks = [
  { symbol: "ACME", name: "Acme Corp", qty: 14 },
  { symbol: "FOOD", name: "FoodWorks", qty: 6 },
  { symbol: "OILX", name: "OilX Ltd.", qty: 0 }
];

// Dummy market stocks
const marketStocks = [
  { symbol: "ACME", name: "Acme Corp" },
  { symbol: "FOOD", name: "FoodWorks" },
  { symbol: "OILX", name: "OilX Ltd." }
];

export default function StockMarket() {
  const [buyOrders, setBuyOrders] = useState([
    { price: 149, qty: 20, symbol: "ACME" },
    { price: 148, qty: 35, symbol: "FOOD" },
    { price: 147, qty: 40, symbol: "OILX" }
  ]);
  const [sellOrders, setSellOrders] = useState([
    { price: 151, qty: 15, symbol: "ACME" },
    { price: 152, qty: 25, symbol: "FOOD" },
    { price: 153, qty: 30, symbol: "OILX" }
  ]);
  const [trades, setTrades] = useState([
    { time: "10:34:12", price: 150, qty: 8, symbol: "ACME", type: "Buy" },
    { time: "10:34:08", price: 151, qty: 10, symbol: "FOOD", type: "Sell" }
  ]);
  const [userStocks, setUserStocks] = useState(initialUserStocks);

  // Simulate order book and trades update
  useEffect(() => {
    const interval = setInterval(() => {
      setBuyOrders(orders =>
        orders.map(order => ({
          ...order,
          price: Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(5, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setSellOrders(orders =>
        orders.map(order => ({
          ...order,
          price: Math.max(1, +(order.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
          qty: Math.max(5, Math.floor(order.qty * (1 + (Math.random() - 0.5) * 0.2)))
        }))
      );
      setTrades(trades => [
        {
          time: new Date().toLocaleTimeString().slice(0, 8),
          price: Math.floor(147 + Math.random() * 8),
          qty: Math.floor(5 + Math.random() * 20),
          symbol: ["ACME", "FOOD", "OILX"][Math.floor(Math.random()*3)],
          type: Math.random() > 0.5 ? "Buy" : "Sell"
        },
        ...trades.slice(0, 19)
      ]);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  function handlePlaceOrder({ type, asset, qty, price, side }) {
    // type: "stock", asset: symbol
    if (side === "Buy") {
      setBuyOrders([
        { price, qty, symbol: asset },
        ...buyOrders
      ]);
    } else {
      setSellOrders([
        { price, qty, symbol: asset },
        ...sellOrders
      ]);
      // Deduct from user holdings
      setUserStocks(stocks => stocks.map(s =>
        s.symbol === asset ? { ...s, qty: s.qty - qty } : s
      ));
    }
  }

  // Filter order book for selected stock (for UI simplicity, show all for now)
  return (
    <div className="stock-market-pro">
      <h2>Stock Exchange</h2>
      <div className="exchange-panel-grid">
        <div>
          <OrderForm
            orderType="stock"
            assets={marketStocks}
            userHoldings={userStocks}
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