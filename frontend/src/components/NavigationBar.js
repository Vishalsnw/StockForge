import React from "react";
import "./NavigationBar.css";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Company", to: "/company" },
  { label: "Market", to: "/market" },
  { label: "Commodity", to: "/commodity" },
  { label: "Stock", to: "/stock" },
  { label: "Leaderboard", to: "/leaderboard" },
];

export default function NavigationBar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-logo">StockForge</div>
      <nav className="navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={
              location.pathname === item.to
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="navbar-user">
        <span>👤 Vishalsnw</span>
      </div>
    </header>
  );
}