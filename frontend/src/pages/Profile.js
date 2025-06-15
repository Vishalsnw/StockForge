import React from "react";
import Portfolio from "../components/Portfolio";

export default function Profile() {
  // You can add more user info and stats here in the future
  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Your Profile</h2>
      <Portfolio />
    </div>
  );
}