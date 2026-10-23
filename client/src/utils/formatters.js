import { CURRENCIES } from './constants';

export const DEFAULT_CURRENCY_RATES = {
  USD: 1.0,
  EUR: 0.89,
  GBP: 0.75,
  INR: 83.5,
  CAD: 1.40,
  AUD: 1.43,
  JPY: 157.0
};

// In-memory active rates cache initialized with default rates
let activeRates = { ...DEFAULT_CURRENCY_RATES };

try {
  const cached = localStorage.getItem('fintrack_live_fx_rates');
  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed && typeof parsed === 'object') {
      activeRates = { ...DEFAULT_CURRENCY_RATES, ...parsed };
    }
  }
} catch (e) {}

export const getActiveRates = () => activeRates;

export const updateActiveRates = (newRates) => {
  activeRates = { ...DEFAULT_CURRENCY_RATES, ...newRates };
  try {
    localStorage.setItem('fintrack_live_fx_rates', JSON.stringify(activeRates));
  } catch (e) {}
  return activeRates;
};

// Live Foreign Exchange API fetcher with dual redundant fallback
export const fetchLiveRates = async () => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const extracted = {
          USD: 1.0,
          EUR: Math.round(data.rates.EUR * 10000) / 10000,
          GBP: Math.round(data.rates.GBP * 10000) / 10000,
          INR: Math.round(data.rates.INR * 100) / 100,
          CAD: Math.round(data.rates.CAD * 10000) / 10000,
          AUD: Math.round(data.rates.AUD * 10000) / 10000,
          JPY: Math.round(data.rates.JPY * 100) / 100
        };
        updateActiveRates(extracted);
        return { success: true, rates: extracted, source: 'open.er-api' };
      }
    }
  } catch (err) {
    console.warn('Primary FX API unavailable, trying secondary...', err);
  }

  try {
    const res2 = await fetch('https://api.frankfurter.dev/v1/latest?base=USD');
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.rates) {
        const extracted2 = {
          USD: 1.0,
          EUR: data2.rates.EUR || DEFAULT_CURRENCY_RATES.EUR,
          GBP: data2.rates.GBP || DEFAULT_CURRENCY_RATES.GBP,
          INR: data2.rates.INR || DEFAULT_CURRENCY_RATES.INR,
          CAD: data2.rates.CAD || DEFAULT_CURRENCY_RATES.CAD,
          AUD: data2.rates.AUD || DEFAULT_CURRENCY_RATES.AUD,
          JPY: data2.rates.JPY || DEFAULT_CURRENCY_RATES.JPY
        };
        updateActiveRates(extracted2);
        return { success: true, rates: extracted2, source: 'frankfurter' };
      }
    }
  } catch (err2) {
    console.warn('Secondary FX API unavailable, keeping cached rates', err2);
  }

  return { success: false, rates: activeRates, source: 'cached' };
};

export const convertCurrency = (amount, fromCode = 'INR', toCode = 'INR', customRates = null) => {
  const num = Number(amount) || 0;
  if (!fromCode || !toCode || fromCode === toCode) {
    return num;
  }

  const rates = customRates || activeRates;
  const fromRate = rates[fromCode] || DEFAULT_CURRENCY_RATES[fromCode] || 1.0;
  const toRate = rates[toCode] || DEFAULT_CURRENCY_RATES[toCode] || 1.0;

  // Convert to USD base first, then convert to target currency
  const amountInUSD = num / fromRate;
  const result = amountInUSD * toRate;

  return Math.round(result * 100) / 100;
};

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const num = Number(amount) || 0;
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const locale = currencyObj.code === 'INR' ? 'en-IN' : 'en-US';
  const decimals = currencyObj.code === 'JPY' ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyObj.code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const exportToCSV = (transactions, filename = 'transactions.csv') => {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Currency', 'Payment Method', 'Notes', 'Recurring'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    t.category,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.amount,
    t.currency || 'INR',
    t.paymentMethod || 'card',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    t.recurring || 'none'
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
