import React, { useEffect, useState } from "react";

/**
 * NewsBot simulates in-game news events based on market data.
 * You can expand this bot to fetch real news, or make news affect the market.
 */
const HEADLINES = [
  "Market surges as investors buy aggressively!",
  "Commodity prices slump amid global oversupply.",
  "Central Bank hints at new policy.",
  "Major tech company beats earnings expectations.",
  "Geopolitical tensions disrupt oil supply.",
  "Wheat harvest sets new records worldwide."
];

function getRandomHeadline() {
  const idx = Math.floor(Math.random() * HEADLINES.length);
  return HEADLINES[idx];
}

export default function NewsBot() {
  const [newsFeed, setNewsFeed] = useState([
    {
      timestamp: new Date(),
      text: "Welcome to StockForge! Stay tuned for the latest market news."
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsFeed((prev) => [
        {
          timestamp: new Date(),
          text: getRandomHeadline()
        },
        ...prev
      ].slice(0, 5)); // keep only the latest 5 news
    }, 12000); // new headline every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: "1em" }}>
      <h3>Market News</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {newsFeed.map((news, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <div style={{ color: "#888", fontSize: "0.85em" }}>
              {news.timestamp.toLocaleTimeString()}
            </div>
            <div>{news.text}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}