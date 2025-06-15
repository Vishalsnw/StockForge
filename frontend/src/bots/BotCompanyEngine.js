import { sectors } from "../data/sectors";
import { botNames } from "../data/botNames";
import { addCompany } from "../data/companies";
import { addCommodityOrder } from "../data/commodityOrders";

export function generateBotCompanies(N = 200) {
  for (let i = 0; i < N; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    const symbol = (botName.slice(0, 3) + sector.name.slice(0, 2) + i).toUpperCase();
    const company = {
      id: "BOT" + (i + 1),
      name: botName + " " + sector.name,
      sector: sector.name,
      symbol,
      rawMaterials: sector.rawMaterials,
      products: sector.products,
      inventory: {},
      balance: 100000 + Math.floor(Math.random() * 500000),
      shares: 100000,
      sharePrice: 10 + Math.random() * 90,
      isBot: true
    };
    addCompany(company);

    // Har product ke liye ek initial sell (Ask) order post karo
    sector.products.forEach(product => {
      addCommodityOrder({
        commodity: product,
        price: 80 + Math.random()*40,
        qty: 50 + Math.floor(Math.random()*100),
        seller: company.name,
        companyId: company.id
      });
    });
  }
}