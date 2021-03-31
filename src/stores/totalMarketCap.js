import { readable, writable } from 'svelte/store';

function getMarketCap() {
  return new Promise((resolve) => {
    fetch(`https://api.coingecko.com/api/v3/global`)
      .then((res) => res.json())
      .then((data) => resolve(data.data.total_market_cap['usd']));
  });
}

export const totalMarketCap = readable(0, function start(set) {
  const interval = setInterval(() => {
    getMarketCap().then((totalMarketCap) => set(totalMarketCap));
  }, 60 * 1 * 1000);
  getMarketCap().then((totalMarketCap) => set(totalMarketCap));
  return function stop() {
    clearInterval(interval);
  };
});

export const predictedMarketCap = writable({
  lower: 3000000000000,
  middle: 5000000000000,
  upper: 8000000000000
});

const toCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export const formatMarketCap = (marketCap) => `${toCurrency(marketCap / 1000000000000)}T`;
