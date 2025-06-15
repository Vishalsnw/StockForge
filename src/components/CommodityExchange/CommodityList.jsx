import React from "react";

const CommodityList = ({ products }) => (
  <div>
    <h2>Commodities</h2>
    <ul>
      {products.map((prod) => (
        <li key={prod._id}>
          {prod.name} by {prod.company?.name} — {prod.quantity} units @ ₹{prod.marketPrice}
        </li>
      ))}
    </ul>
  </div>
);

export default CommodityList;