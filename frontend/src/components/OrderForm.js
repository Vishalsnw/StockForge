import './OrderForm.css';
import React, { useState } from "react";
import "./OrderForm.css";

// orderType: "stock" or "commodity"
// userHoldings: array of {symbol/name, qty}
// onPlaceOrder: function({type, symbol/name, qty, price, side})
export default function OrderForm({ orderType, assets, userHoldings, onPlaceOrder }) {
  const [side, setSide] = useState("Buy");
  const [asset, setAsset] = useState(assets.length > 0 ? assets[0].symbol || assets[0].name : "");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  // Check user has enough to sell
  function validate() {
    if (!asset) return "Please select an asset.";
    if (!qty || isNaN(qty) || qty <= 0) return "Enter a valid quantity.";
    if (!price || isNaN(price) || price <= 0) return "Enter a valid price.";
    if (side === "Sell") {
      const holding = userHoldings.find(
        h => (h.symbol || h.name) === asset
      );
      if (!holding || Number(qty) > holding.qty)
        return `You don't have enough ${asset} to sell.`;
    }
    return "";
  }
  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onPlaceOrder({
      type: orderType,
      asset,
      qty: Number(qty),
      price: Number(price),
      side
    });
    setQty("");
    setPrice("");
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h4>Place {orderType === "stock" ? "Stock" : "Commodity"} Order</h4>
      <div className="order-form-row">
        <label>Type:</label>
        <select value={side} onChange={e => setSide(e.target.value)}>
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </div>
      <div className="order-form-row">
        <label>{orderType === "stock" ? "Stock" : "Commodity"}:</label>
        <select value={asset} onChange={e => setAsset(e.target.value)}>
          {assets.map(a => (
            <option key={a.symbol || a.name} value={a.symbol || a.name}>
              {a.symbol ? `${a.symbol} (${a.name})` : a.name}
            </option>
          ))}
        </select>
      </div>
      <div className="order-form-row">
        <label>Quantity:</label>
        <input
          type="number"
          value={qty}
          min={1}
          step={1}
          onChange={e => setQty(e.target.value)}
        />
      </div>
      <div className="order-form-row">
        <label>Price:</label>
        <input
          type="number"
          value={price}
          min={1}
          step="any"
          onChange={e => setPrice(e.target.value)}
        />
      </div>
      {error && <div className="order-form-error">{error}</div>}
      <button type="submit" className="order-form-btn">
        Place Order
      </button>
    </form>
  );
}