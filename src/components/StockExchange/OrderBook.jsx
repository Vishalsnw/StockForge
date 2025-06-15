import React from "react";

const OrderBook = ({ orders }) => (
  <div>
    <h2>Stock Order Book</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Company</th>
          <th>Price</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order.type}</td>
            <td>{order.company?.name}</td>
            <td>{order.price}</td>
            <td>{order.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderBook;