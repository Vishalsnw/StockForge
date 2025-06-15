import React from "react";
import "./Dashboard.css";
import NewsFeed from "./NewsFeed";
import Portfolio from "./Portfolio";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="dashboard-main">
        <h2>Welcome to StockForge!</h2>
        <p>
          Play as a business tycoon. Trade stocks, commodities, manage your company,
          and climb the leaderboard!
        </p>
        <div className="dashboard-widgets">
          <div className="dashboard-widget">
            <Portfolio compact />
          </div>
          <div className="dashboard-widget">
            <NewsFeed compact />
          </div>
        </div>
      </section>
    </div>
  );
}