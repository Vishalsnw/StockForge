const STORAGE_KEY = "market_commodity_orders";

function loadOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

export let commodityOrders = loadOrders();

export function addCommodityOrder(order) {
  commodityOrders.push(order);
  saveOrders(commodityOrders);
}

export function setCommodityOrders(newOrders) {
  commodityOrders = newOrders;
  saveOrders(commodityOrders);
}