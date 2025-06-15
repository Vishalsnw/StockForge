import React from "react";

const CompanyCard = ({ company }) => (
  <div className="company-card">
    <h3>{company.name}</h3>
    <p>Sector: {company.sector}</p>
    <p>{company.description}</p>
  </div>
);

export default CompanyCard;