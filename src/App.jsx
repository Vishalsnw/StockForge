import React from "react";
import { CompanyProvider } from "./context/CompanyContext";
import { ExchangeProvider } from "./context/ExchangeContext";
import { BotProvider } from "./context/BotContext";
import Home from "./pages/Home";
import useMobileFriendly from "./hooks/useMobileFriendly";

function App() {
  useMobileFriendly();

  return (
    <CompanyProvider>
      <ExchangeProvider>
        <BotProvider>
          <div style={{ maxWidth: 480, margin: "auto", padding: 12 }}>
            <Home />
          </div>
        </BotProvider>
      </ExchangeProvider>
    </CompanyProvider>
  );
}

export default App;