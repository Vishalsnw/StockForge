import './OrderBook.css';
import React from "react";
import "./OrderBook.css";

// Accepts listedStocks to show company name/symbol in orderbook
export default function OrderBook({ buyOrders = [], sellOrders = [], listedStocks = [] }) {
  return (
    <div className="orderbook">
      <div className="orderbook-header">
        <span>Buy Orders</span>
        <span>Sell Orders</span>
      </div>
      <div className="orderbook-body">
        <div className="orderbook-side">
          {buyOrders.map((order, idx) => (
            <div className="orderbook-row buy" key={idx}>
              <span className="orderbook-symbol">
                {order.symbol}
              </span>
              <span className="orderbook-price">{order.price}</span>
              <span className="orderbook-qty">{order.qty}</span>
            </div>
          ))}
        </div>
        <div className="orderbook-side">
          {sellOrders.map((order, idx) => (
            <div className="orderbook-row sell" key={idx}>
              <span className="orderbook-symbol">
                {order.symbol}
              </span>
              <span className="orderbook-price">{order.price}</span>
              <span className="orderbook-qty">{order.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}