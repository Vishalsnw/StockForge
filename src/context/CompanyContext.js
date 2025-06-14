import React, { createContext, useState, useEffect } from "react";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []));
  }, []);

  return (
    <CompanyContext.Provider value={{ companies, setCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
};