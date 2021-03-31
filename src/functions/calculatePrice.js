export function calulatePredictedMarketDominance(currentDominance, multiplier) {
  return currentDominance * multiplier;
}

export function calulatePredictedMarketCap(currentDominance, multiplier) {
  return currentDominance / multiplier;
}

export function calculatePrice(marketCap, circulatingSupply) {
  return marketCap / circulatingSupply;
}

export function calculatePredictedPrice(coin, mdsMultiplier, marketCap) {
  let predictedMarketDominance = calulatePredictedMarketDominance(
    coin.marketDominance,
    mdsMultiplier
  );
  let predictedMarketCap = calulatePredictedMarketCap(marketCap, predictedMarketDominance);
  let predictedPrice = calculatePrice(predictedMarketCap, coin.circulatingSupply);
  return {
    price: predictedPrice,
    marketDominance: predictedMarketDominance,
    marketCap: predictedMarketCap
  };
}
