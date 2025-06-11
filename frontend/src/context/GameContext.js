import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { playerCompany } = useCompany();

  // Game state
  const [gameStats, setGameStats] = useState({
    totalPlayers: 12847,
    activeCompanies: 8934,
    totalTrades: 2847592,
    marketVolume: 15847329645,
    lastUpdated: new Date().toISOString()
  });

  const [achievements, setAchievements] = useState([]);
  const [leaderboards, setLeaderboards] = useState({
    wealth: [],
    companies: [],
    traders: [],
    achievements: []
  });

  const [playerProgress, setPlayerProgress] = useState({
    level: 1,
    xp: 0,
    xpToNext: 1000,
    totalXP: 0,
    rank: null,
    title: 'Entrepreneur'
  });

  const [notifications, setNotifications] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  // Achievement definitions
  const ACHIEVEMENTS = [
    {
      id: 'first_company',
      name: 'Business Pioneer',
      description: 'Create your first company',
      icon: '🏢',
      category: 'company',
      rarity: 'common',
      xp: 100,
      requirements: { companiesCreated: 1 }
    },
    {
      id: 'first_million',
      name: 'Millionaire',
      description: 'Accumulate ₹10,00,000 in total wealth',
      icon: '💰',
      category: 'wealth',
      rarity: 'uncommon',
      xp: 500,
      requirements: { totalWealth: 1000000 }
    },
    {
      id: 'first_ipo',
      name: 'Public Company',
      description: 'Launch your first IPO',
      icon: '🚀',
      category: 'company',
      rarity: 'rare',
      xp: 1000,
      requirements: { iposLaunched: 1 }
    },
    {
      id: 'level_10_company',
      name: 'Corporate Giant',
      description: 'Reach company level 10',
      icon: '🏭',
      category: 'company',
      rarity: 'epic',
      xp: 2000,
      requirements: { maxCompanyLevel: 10 }
    },
    {
      id: 'hundred_trades',
      name: 'Active Trader',
      description: 'Complete 100 stock trades',
      icon: '📈',
      category: 'trading',
      rarity: 'uncommon',
      xp: 750,
      requirements: { totalTrades: 100 }
    },
    {
      id: 'profitable_trader',
      name: 'Profit Master',
      description: 'Achieve ₹1,00,000 in trading profits',
      icon: '💹',
      category: 'trading',
      rarity: 'rare',
      xp: 1500,
      requirements: { tradingProfits: 100000 }
    },
    {
      id: 'diversified_portfolio',
      name: 'Diversification Expert',
      description: 'Hold stocks in 10 different companies',
      icon: '📊',
      category: 'trading',
      rarity: 'rare',
      xp: 1200,
      requirements: { uniqueStocks: 10 }
    },
    {
      id: 'resource_baron',
      name: 'Resource Baron',
      description: 'Own 1000+ units of any resource',
      icon: '⛏️',
      category: 'resources',
      rarity: 'epic',
      xp: 1800,
      requirements: { maxResourceOwned: 1000 }
    },
    {
      id: 'market_leader',
      name: 'Market Leader',
      description: 'Rank #1 in any leaderboard',
      icon: '👑',
      category: 'ranking',
      rarity: 'legendary',
      xp: 5000,
      requirements: { topRanking: 1 }
    },
    {
      id: 'consistent_player',
      name: 'Consistency King',
      description: 'Login for 30 consecutive days',
      icon: '📅',
      category: 'activity',
      rarity: 'rare',
      xp: 1000,
      requirements: { consecutiveDays: 30 }
    }
  ];

  // Player titles based on level
  const PLAYER_TITLES = [
    { level: 1, title: 'Entrepreneur', icon: '💼' },
    { level: 5, title: 'Business Owner', icon: '🏢' },
    { level: 10, title: 'Corporate Leader', icon: '👔' },
    { level: 15, title: 'Industry Mogul', icon: '💰' },
    { level: 20, title: 'Market Titan', icon: '🏆' },
    { level: 25, title: 'Economic Powerhouse', icon: '⚡' },
    { level: 30, title: 'Global Tycoon', icon: '🌍' },
    { level: 50, title: 'Legendary Magnate', icon: '👑' }
  ];

  // Daily challenges
  const DAILY_CHALLENGES = [
    {
      id: 'trade_volume',
      name: 'Trading Frenzy',
      description: 'Execute trades worth ₹50,000',
      icon: '📈',
      target: 50000,
      progress: 0,
      reward: { xp: 200, money: 5000 },
      type: 'trading'
    },
    {
      id: 'company_growth',
      name: 'Growth Spurt',
      description: 'Increase company valuation by ₹1,00,000',
      icon: '🚀',
      target: 100000,
      progress: 0,
      reward: { xp: 300, money: 10000 },
      type: 'company'
    },
    {
      id: 'resource_collection',
      name: 'Resource Gatherer',
      description: 'Collect 100 units of any resource',
      icon: '⛏️',
      target: 100,
      progress: 0,
      reward: { xp: 150, money: 7500 },
      type: 'resources'
    }
  ];

  // Initialize game data
  useEffect(() => {
    if (user) {
      loadPlayerData();
      loadLeaderboards();
      generateDailyChallenge();
    }
  }, [user]);

  // Load player data
  const loadPlayerData = useCallback(() => {
    if (!user) return;

    // Load achievements
    const savedAchievements = localStorage.getItem(`achievements_${user.username}`);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    // Load player progress
    const savedProgress = localStorage.getItem(`progress_${user.username}`);
    if (savedProgress) {
      setPlayerProgress(JSON.parse(savedProgress));
    } else {
      // Initialize new player
      setPlayerProgress({
        level: 1,
        xp: 0,
        xpToNext: 1000,
        totalXP: 0,
        rank: null,
        title: 'Entrepreneur',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        consecutiveDays: 1
      });
    }

    // Load notifications
    const savedNotifications = localStorage.getItem(`notifications_${user.username}`);
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, [user]);

  // Save player data
  useEffect(() => {
    if (user) {
      localStorage.setItem(`achievements_${user.username}`, JSON.stringify(achievements));
      localStorage.setItem(`progress_${user.username}`, JSON.stringify(playerProgress));
      localStorage.setItem(`notifications_${user.username}`, JSON.stringify(notifications));
    }
  }, [achievements, playerProgress, notifications, user]);

  // Add XP and handle level ups
  const addXP = useCallback((amount, source = 'General') => {
    setPlayerProgress(prev => {
      const newTotalXP = prev.totalXP + amount;
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNext;

      // Check for level up
      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel++;
        newXPToNext = calculateXPForLevel(newLevel + 1) - calculateXPForLevel(newLevel);
        
        // Level up notification
        addNotification({
          type: 'level_up',
          title: 'Level Up!',
          message: `Congratulations! You've reached level ${newLevel}`,
          icon: '🎉',
          importance: 'high'
        });

        // Check for title upgrade
        const newTitle = PLAYER_TITLES.find(t => t.level === newLevel);
        if (newTitle) {
          addNotification({
            type: 'title_unlock',
            title: 'New Title Unlocked!',
            message: `You are now a ${newTitle.title} ${newTitle.icon}`,
            icon: '👑',
            importance: 'high'
          });
        }
      }

      const updatedProgress = {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: newXPToNext,
        totalXP: newTotalXP,
        title: PLAYER_TITLES.find(t => t.level <= newLevel)?.title || prev.title
      };

      // XP gain notification
      addNotification({
        type: 'xp_gain',
        title: 'XP Gained',
        message: `+${amount} XP from ${source}`,
        icon: '⭐',
        importance: 'low'
      });

      return updatedProgress;
    });
  }, []);

  // Calculate XP required for level
  const calculateXPForLevel = useCallback((level) => {
    return Math.floor(1000 * Math.pow(1.2, level - 1));
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback(() => {
    if (!user || !playerCompany) return;

    const playerStats = {
      companiesCreated: playerCompany ? 1 : 0,
      totalWealth: user.balance + (playerCompany?.valuation || 0),
      iposLaunched: playerCompany?.isPublic ? 1 : 0,
      maxCompanyLevel: playerCompany?.level || 0,
      totalTrades: 0, // Would come from trading context
      tradingProfits: 0, // Would come from trading context
      uniqueStocks: 0, // Would come from trading context
      maxResourceOwned: Math.max(...Object.values(playerCompany?.resources || {})),
      topRanking: null, // Would come from leaderboard position
      consecutiveDays: playerProgress.consecutiveDays || 1
    };

    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if (achievements.find(a => a.id === achievement.id)) return;

      // Check if requirements are met
      const requirementsMet = Object.keys(achievement.requirements).every(key => {
        return playerStats[key] >= achievement.requirements[key];
      });

      if (requirementsMet) {
        unlockAchievement(achievement);
      }
    });
  }, [user, playerCompany, achievements, playerProgress]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievement) => {
    const unlockedAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString()
    };

    setAchievements(prev => [...prev, unlockedAchievement]);
    addXP(achievement.xp, `Achievement: ${achievement.name}`);

    addNotification({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
      icon: '🏆',
      importance: 'high',
      achievement: unlockedAchievement
    });
  }, [addXP]);

  // Load leaderboards (simulated data)
  const loadLeaderboards = useCallback(() => {
    // Simulate leaderboard data
    const wealthLeaderboard = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      username: i === 0 ? user?.username : `Player${i + 1}`,
      wealth: Math.floor(Math.random() * 10000000) + 1000000,
      level: Math.floor(Math.random() * 30) + 1,
      title: PLAYER_TITLES.find(t => t.level <= Math.floor(Math.random() * 30) + 1)?.title || 'Entrepreneur'
    })).sort((a, b) => b.wealth - a.wealth);

    const companyLeaderboard = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      companyName: `Company ${i + 1}`,
      owner: i === 0 && playerCompany ? user?.username : `Player${i + 1}`,
      valuation: Math.floor(Math.random() * 50000000) + 5000000,
      level: Math.floor(Math.random() * 20) + 1,
      sector: ['Technology', 'Manufacturing', 'Energy', 'Finance', 'Healthcare'][Math.floor(Math.random() * 5)]
    })).sort((a, b) => b.valuation - a.valuation);

    setLeaderboards({
      wealth: wealthLeaderboard,
      companies: companyLeaderboard,
      traders: [], // Would be populated with trading data
      achievements: achievements.length > 0 ? [{ username: user?.username, count: achievements.length }] : []
    });

    // Update player rank
    const playerRank = wealthLeaderboard.find(p => p.username === user?.username)?.rank;
    if (playerRank) {
      setPlayerProgress(prev => ({ ...prev, rank: playerRank }));
    }
  }, [user, playerCompany, achievements]);

  // Generate daily challenge
  const generateDailyChallenge = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedChallenge = localStorage.getItem(`dailyChallenge_${today}`);
    
    if (savedChallenge) {
      setDailyChallenge(JSON.parse(savedChallenge));
    } else {
      const randomChallenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
      const newChallenge = {
        ...randomChallenge,
        id: `${randomChallenge.id}_${today}`,
        date: today,
        progress: 0,
        completed: false
      };
      
      setDailyChallenge(newChallenge);
      localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify(newChallenge));
    }
  }, []);

  // Update daily challenge progress
  const updateChallengeProgress = useCallback((type, amount) => {
    if (!dailyChallenge || dailyChallenge.completed || dailyChallenge.type !== type) return;

    const newProgress = Math.min(dailyChallenge.progress + amount, dailyChallenge.target);
    const completed = newProgress >= dailyChallenge.target;

    const updatedChallenge = {
      ...dailyChallenge,
      progress: newProgress,
      completed
    };

    setDailyChallenge(updatedChallenge);
    localStorage.setItem(`dailyChallenge_${dailyChallenge.date}`, JSON.stringify(updatedChallenge));

    if (completed) {
      // Reward player
      addXP(updatedChallenge.reward.xp, 'Daily Challenge');
      updateUser({ balance: user.balance + updatedChallenge.reward.money });

      addNotification({
        type: 'challenge_complete',
        title: 'Daily Challenge Complete!',
        message: `${updatedChallenge.icon} ${updatedChallenge.name} completed! +${updatedChallenge.reward.xp} XP, +₹${updatedChallenge.reward.money}`,
        icon: '🎯',
        importance: 'high'
      });
    }
  }, [dailyChallenge, addXP, user, updateUser]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update game stats periodically
  useEffect(() => {
    const updateStats = () => {
      setGameStats(prev => ({
        totalPlayers: prev.totalPlayers + Math.floor(Math.random() * 5),
        activeCompanies: prev.activeCompanies + Math.floor(Math.random() * 3),
        totalTrades: prev.totalTrades + Math.floor(Math.random() * 100),
        marketVolume: prev.marketVolume + Math.floor(Math.random() * 1000000),
        lastUpdated: new Date().toISOString()
      }));
    };

    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Check achievements periodically
  useEffect(() => {
    checkAchievements();
  }, [user, playerCompany, checkAchievements]);

  const value = {
    // Game data
    gameStats,
    achievements,
    leaderboards,
    playerProgress,
    notifications,
    dailyChallenge,

    // Game functions
    addXP,
    unlockAchievement,
    checkAchievements,
    loadLeaderboards,
    updateChallengeProgress,

    // Notifications
    addNotification,
    markNotificationRead,
    clearNotifications,

    // Constants
    ACHIEVEMENTS,
    PLAYER_TITLES,
    DAILY_CHALLENGES,

    // Utility functions
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },
    
    getRarityColor: (rarity) => {
      const colors = {
        common: '#6b7280',
        uncommon: '#059669',
        rare: '#2563eb',
        epic: '#7c3aed',
        legendary: '#f59e0b'
      };
      return colors[rarity] || colors.common;
    }
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
