import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MarketBotProvider } from "./bots/MarketBot";
import { UserProvider } from "./context/UserContext";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Company from "./pages/Company";
import Market from "./pages/Market";
import StockMarket from "./components/StockMarket";
import CommodityMarket from "./components/CommodityMarket";
import Profile from "./pages/Profile";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

function App() {
  return (
    <Router>
      <UserProvider>
        <MarketBotProvider>
          <div className="app-layout">
            <NavigationBar />
            <div className="app-content">
              <main className="main-panel">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/company" element={<Company />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/stock" element={<StockMarket />} />
                  <Route path="/commodity" element={<CommodityMarket />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </div>
        </MarketBotProvider>
      </UserProvider>
    </Router>
  );
}

export default App;