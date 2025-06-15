// 200+ unique market bots with company listings

export const marketBots = [
  // Format: { id, name, company, symbol }
  { id: 1, name: "Alpha Capital", company: "Alpha Corp", symbol: "ALPH" },
  { id: 2, name: "Zenith Ventures", company: "Zenith Holdings", symbol: "ZNT" },
  { id: 3, name: "Titan Securities", company: "Titan Industries", symbol: "TITN" },
  { id: 4, name: "Nova Investments", company: "Nova Chemicals", symbol: "NOVA" },
  { id: 5, name: "Quantum Markets", company: "Quantum Labs", symbol: "QNTM" },
  { id: 6, name: "Vertex Partners", company: "Vertex Tech", symbol: "VTX" },
  { id: 7, name: "Summit Traders", company: "Summit Foods", symbol: "SUMT" },
  { id: 8, name: "Orion Holdings", company: "Orion Motors", symbol: "ORIN" },
  { id: 9, name: "Pioneer Global", company: "Pioneer Steel", symbol: "PION" },
  { id: 10, name: "Matrix Advisors", company: "Matrix Infotech", symbol: "MTRX" },
  // ... 190 more
  // For brevity, using a loop (expand as needed)
  ...Array.from({length: 191}, (_, i) => ({
    id: 11 + i,
    name: `BotTrader${i + 1}`,
    company: `Company${i + 1}`,
    symbol: `CMP${(i + 1).toString().padStart(3, "0")}`
  }))
];

// All unique companies listed in the stock market
export const listedCompanies = marketBots.map(bot => ({
  symbol: bot.symbol,
  name: bot.company
}));