import React from "react";
import "./Leaderboard.css";

const leaderboard = [
  { name: "Vishalsnw", score: 120000, rank: 1 },
  { name: "Aakash", score: 110500, rank: 2 },
  { name: "Neha", score: 94500, rank: 3 },
  { name: "Simran", score: 83000, rank: 4 },
  { name: "Rahul", score: 78000, rank: 5 }
];

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Net Worth</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr key={entry.rank} className={entry.rank === 1 ? "first-place" : ""}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>₹{entry.score.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}