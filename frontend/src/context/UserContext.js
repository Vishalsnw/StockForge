import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "market_user";
const defaultUser = { name: "You", balance: 100000, companies: [] };

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
      return defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  function deductBalance(amount) {
    setUser(u => ({ ...u, balance: u.balance - amount }));
  }

  function addCompany(companyId) {
    setUser(u => ({ ...u, companies: [...u.companies, companyId] }));
  }

  return (
    <UserContext.Provider value={{ user, setUser, deductBalance, addCompany }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}