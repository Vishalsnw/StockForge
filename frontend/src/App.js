import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MarketBotProvider } from "./bots/MarketBot";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Company from "./pages/Company";
import Market from "./pages/Market";
import Stock from "./pages/Stock";
import Commodity from "./pages/Commodity";
import Profile from "./pages/Profile";
import Leaderboard from "./components/Leaderboard";
import NewsFeed from "./components/NewsFeed";
import ChatBot from "./bots/ChatBot";
import "./App.css";

function App() {
  return (
    <Router>
      <MarketBotProvider>
        <div className="app-layout">
          <NavigationBar />
          <div className="app-content">
            <aside className="sidebar">
              <NewsFeed compact />
              <div style={{ marginTop: "2rem" }}>
                <ChatBot />
              </div>
            </aside>
            <main className="main-panel">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/company" element={<Company />} />
                <Route path="/market" element={<Market />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/commodity" element={<Commodity />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </div>
      </MarketBotProvider>
    </Router>
  );
}

export default App;
