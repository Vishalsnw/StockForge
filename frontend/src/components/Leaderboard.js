import React from "react";
import { companies } from "../data/companies";

function getLeaderboard(companies) {
  // Example: sort by balance, top 10 (real logic: you can replace as needed)
  return companies
    .filter((c) => c.isBot)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10);
}

export default function Leaderboard() {
  const top = getLeaderboard(companies);
  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Company</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {top.map((c, idx) => (
            <tr key={c.id}>
              <td>{idx + 1}</td>
              <td>{c.name}</td>
              <td>₹{c.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}