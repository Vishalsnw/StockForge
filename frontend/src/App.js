import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import TradingInterface from './components/Trading/TradingInterface';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState({
    username: 'Vishalsnw',
    email: 'vishal@stockforge.com',
    balance: 100000,
    portfolio: 25000,
    isLoggedIn: true,
    lastLogin: '2025-06-11 17:28:49',
    memberSince: '2025-01-15'
  });

  const [marketStatus, setMarketStatus] = useState({
    isOpen: true,
    statusText: 'Market Open',
    nextSession: 'Closes at 15:30 IST',
    timezone: 'IST'
  });

  const [globalStats, setGlobalStats] = useState({
    totalUsers: 12847,
    activeTraders: 3456,
    dailyVolume: '₹2,34,56,78,901',
    totalTrades: 45892,
    onlineUsers: 1247
  });

  // Navigation items
  const navigationItems = [
    {
