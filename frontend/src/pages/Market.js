import React, { useState } from "react";
import MarketTicker from "../components/MarketTicker";
import RegisterCompanyModal from "../components/RegisterCompanyModal";
import CompanyDashboard from "../components/CompanyDashboard";
import { companies } from "../data/companies";
import { useUser } from "../context/UserContext";
import "./MarketPage.css";

export default function Market() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const { user } = useUser();

  function handleRegister() {
    setRefresh(x => x + 1);
  }

  return (
    <div className="market-page">
      <MarketTicker />
      <h1>Market Overview</h1>
      <div style={{marginBottom:"1rem",color:"#00ffb0"}}>Your Balance: ₹{user.balance.toLocaleString()}</div>
      <button onClick={() => setModalOpen(true)}>
        Open New Company
      </button>
      <p>Track all companies, sectors, and create your own business empire! Click any company to view dashboard.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:"1.5rem",margin:"2rem 0"}}>
        {companies.map(c => (
          <div key={c.id}
               style={{
                border:"1px solid #2b3240",borderRadius:"8px",padding:"1rem",minWidth:220,cursor:"pointer",
                background:selectedCompany && selectedCompany.id===c.id ? "#2a3344":"#22272f"
              }}
               onClick={()=>setSelectedCompany(c)}>
            <b>{c.name}</b>
            <br/><span>{c.sector}</span>
            <br/><span style={{color:"#ffe39a"}}>{c.symbol}</span>
            <br/><span>₹{c.sharePrice.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <CompanyDashboard company={selectedCompany} />
      <RegisterCompanyModal open={modalOpen} onClose={()=>setModalOpen(false)} onRegister={handleRegister}/>
    </div>
  );
}