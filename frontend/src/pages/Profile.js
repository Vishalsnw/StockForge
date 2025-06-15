import React from "react";
import { useUser } from "../context/UserContext";
export default function Profile() {
  const { user } = useUser();
  return (
    <div>
      <h1>Your Profile</h1>
      <p>Name: {user.name}</p>
      <p>Balance: ₹{user.balance}</p>
      <p>Companies owned: {user.companies && user.companies.length}</p>
    </div>
  );
}