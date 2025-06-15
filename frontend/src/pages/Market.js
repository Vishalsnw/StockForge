import React from "react";
import { companies } from "../data/companies";

export default function Market() {
  return (
    <div>
      <h1>Market Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sector</th>
            <th>Symbol</th>
            <th>Share Price</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.sector}</td>
              <td>{c.symbol}</td>
              <td>₹{c.sharePrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}