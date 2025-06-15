import React from "react";

const DashboardSummary = ({ user }) => (
  <div>
    <h2>Welcome, {user.username}</h2>
    <p>Balance: ₹{user.balance}</p>
    <p>Companies Owned: {user.companies?.length || 0}</p>
  </div>
);

export default DashboardSummary;