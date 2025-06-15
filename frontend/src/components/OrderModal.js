import React, { useState } from "react";
import "./OrderModal.css";

// props: open, onClose, orderType, assets, userHoldings, onPlaceOrder
export default function OrderModal({ open, onClose, ...props }) {
  if (!open) return null;
  return (
    <div className="order-modal-backdrop" onClick={onClose}>
      <div
        className="order-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <button className="order-modal-close" onClick={onClose}>
          ×
        </button>
        <props.OrderForm {...props} />
      </div>
    </div>
  );
}