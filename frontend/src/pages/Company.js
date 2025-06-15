import React from "react";
import { companies } from "../data/companies";
export default function Company() {
  return (
    <div>
      <h1>Company Dashboard</h1>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            <b>{c.name}</b> ({c.symbol}) — Sector: {c.sector}
          </li>
        ))}
      </ul>
    </div>
  );
}