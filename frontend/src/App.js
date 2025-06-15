import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Scroll to top on route change (fixes stuck page for Single Page Apps)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company" element={<Company />} />
      <Route path="/market" element={<Market />} />
      <Route path="/stock" element={<StockMarket />} />
      <Route path="/commodity" element={<CommodityMarket />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <MarketBotProvider>
          <div className="app-layout">
            <NavigationBar />
            <div className="app-content">
              <main className="main-panel">
                <ScrollToTop />
                <AppRoutes />
              </main>
            </div>
          </div>
        </MarketBotProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
