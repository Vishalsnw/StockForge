import React, { useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";
import CompanyCard from "../components/Company/CompanyCard";

const Home = () => {
  const { companies } = useContext(CompanyContext);

  return (
    <div>
      <h1>Sim Companies Dual Exchange</h1>
      <div>
        <h2>Listed Companies</h2>
        {companies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}
      </div>
    </div>
  );
};

export default Home;