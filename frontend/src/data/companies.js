// Companies array + addCompany helper, with localStorage persistence

const STORAGE_KEY = "market_companies";

function loadCompanies() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
}

function saveCompanies(companies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  } catch {}
}

// Companies array (exported, always in sync with localStorage)
export let companies = loadCompanies();

export function addCompany(company) {
  companies.push(company);
  saveCompanies(companies);
}

export function setCompanies(newCompanies) {
  companies = newCompanies;
  saveCompanies(companies);
}
