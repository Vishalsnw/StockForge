import React from "react";
import "./OrderBook.css";

export default function OrderBook({ buyOrders = [], sellOrders = [] }) {
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
              <span className="orderbook-price">{order.price}</span>
              <span className="orderbook-qty">{order.qty}</span>
            </div>
          ))}
        </div>
        <div className="orderbook-side">
          {sellOrders.map((order, idx) => (
            <div className="orderbook-row sell" key={idx}>
              <span className="orderbook-price">{order.price}</span>
              <span className="orderbook-qty">{order.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}