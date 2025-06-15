import React, { useState } from "react";
import { sectors } from "../data/sectors";
import { companies } from "../data/companies";

export default function RegisterCompanyModal({ open, onClose, onRegister }) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState(sectors[0].name);
  const [capital, setCapital] = useState(100000);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const sectorData = sectors.find(s => s.name === sector);
    const symbol = (name.slice(0, 3) + sector.slice(0, 2) + Date.now()%1000).toUpperCase();
    const company = {
      id: "USER_" + Date.now(),
      name,
      sector,
      symbol,
      rawMaterials: sectorData.rawMaterials,
      products: sectorData.products,
      inventory: {},
      balance: capital,
      shares: 100000,
      sharePrice: 10,
      isBot: false
    };
    companies.push(company);
    onRegister(company);
    onClose();
  }

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal-content" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Register New Company</h3>
        <label>
          Company Name:
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Sector:
          <select value={sector} onChange={e => setSector(e.target.value)}>
            {sectors.map(s => <option key={s.name}>{s.name}</option>)}
          </select>
        </label>
        <label>
          Starting Capital:
          <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} min={10000} required />
        </label>
        <button type="submit">Create Company</button>
      </form>
    </div>
  );
}