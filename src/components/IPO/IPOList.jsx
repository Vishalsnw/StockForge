import React from "react";

const IPOList = ({ ipos }) => (
  <div>
    <h2>Open IPOs</h2>
    <ul>
      {ipos.map((ipo) => (
        <li key={ipo._id}>
          {ipo.company?.name} - Shares: {ipo.sharesAvailable} @ ₹{ipo.sharePrice}
        </li>
      ))}
    </ul>
  </div>
);

export default IPOList;