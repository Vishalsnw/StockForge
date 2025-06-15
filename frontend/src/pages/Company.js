import React from "react";
import { companies } from "../data/companies";

export default function Company() {
  return (
    <div>
      <h1>Company Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sector</th>
            <th>Symbol</th>
            <th>Share Price</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.sector}</td>
              <td>{c.symbol}</td>
              <td>₹{c.sharePrice.toFixed(2)}</td>
              <td>₹{c.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}