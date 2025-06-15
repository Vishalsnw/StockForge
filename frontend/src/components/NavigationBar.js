import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

export default function NavigationBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">StockForge</Link>
      <Link to="/company">Company</Link>
      <Link to="/market">Market</Link>
      <Link to="/commodity">Commodity</Link>
      <Link to="/stock">Stock</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/profile">👤 Vishalsnw</Link>
    </nav>
  );
}