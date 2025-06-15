import React, { useState, useEffect } from "react";
import { useMarketBots } from "../bots/MarketBot";
import OrderBook from "./OrderBook";
import RecentTrades from "./RecentTrades";
import MarketTicker from "./MarketTicker";
import OrderModal from "./OrderModal";
import OrderForm from "./OrderForm";
import "./StockMarket.css";

export default function StockMarket() {
  const { bots } = useMarketBots();
  // All companies listed
  const marketStocks = bots.map(bot => ({
    symbol: bot.symbol,
    name: bot.company
  }));

  // Example user holdings (simulate some stocks owned)
  const [userStocks, setUserStocks] = useState(
    marketStocks.map((c, i) => ({
      symbol: c.symbol,
      name: c.name,
      qty: Math.floor(Math.random() * 50)
    }))
  );

  // Show only first 20 stocks in orderbook/trades for performance/demo
  const shownStocks = marketStocks.slice(0, 20);

  // Dummy orderbook/trades for shown stocks (expand as needed)
  const [buyOrders, setBuyOrders] = useState(
    shownStocks.map(stock => ({
      price: Math.floor(50 + Math.random() * 100),
      qty: Math.floor(1 + Math.random() * 100),
      symbol: stock.symbol
    }))
  );
  const [sellOrders, setSellOrders] = useState(
    shownStocks.map(stock => ({
      price: Math.floor(100 + Math.random() * 100),
      qty: Math.floor(1 + Math.random() * 100),
      symbol: stock.symbol
    }))
  );
  const [trades, setTrades] = useState(
    shownStocks.map(stock => ({
      time: new Date().toLocaleTimeString().slice(0,8),
      price: Math.floor(75 + Math.random() * 50),
      qty: Math.floor(1 + Math.random() * 100),
      symbol: stock.symbol,
      type: Math.random() > 0.5 ? "Buy" : "Sell"
    }))
  );

  // Buy/Sell modal
  const [modalOpen, setModalOpen] = useState(false);

  // Handle placing order
  function handlePlaceOrder({ type, asset, qty, price, side }) {
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
      setUserStocks(stocks =>
        stocks.map(s =>
          s.symbol === asset ? { ...s, qty: s.qty - qty } : s
        )
      );
    }
    setModalOpen(false);
  }

  return (
    <div className="stock-market-pro">
      <MarketTicker />
      <h2>Stock Exchange</h2>
      <button
        className="main-trade-btn"
        onClick={() => setModalOpen(true)}
      >
        Trade (Buy/Sell)
      </button>
      <div className="exchange-panel-grid">
        <div>
          <OrderBook
            buyOrders={buyOrders}
            sellOrders={sellOrders}
            listedStocks={shownStocks}
          />
        </div>
        <RecentTrades trades={trades} />
      </div>
      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        orderType="stock"
        assets={marketStocks}
        userHoldings={userStocks}
        onPlaceOrder={handlePlaceOrder}
        OrderForm={OrderForm}
      />
    </div>
  );
}