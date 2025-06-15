import React from "react";
import "./RecentTrades.css";

export default function RecentTrades({ trades = [] }) {
  return (
    <div className="recent-trades">
      <div className="recent-trades-header">Recent Trades</div>
      <div className="recent-trades-table">
        <div className="recent-trades-row recent-trades-row--header">
          <span>Time</span>
          <span>Price</span>
          <span>Qty</span>
          <span>Type</span>
        </div>
        {trades.map((trade, i) => (
          <div
            className={
              "recent-trades-row " +
              (trade.type === "Buy" ? "buy" : "sell")
            }
            key={i}
          >
            <span>{trade.time}</span>
            <span>{trade.price}</span>
            <span>{trade.qty}</span>
            <span>{trade.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}