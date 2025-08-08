const FINNHUB_API_KEY = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830';
const COINGECKO_API_KEY = 'CG-R4jRckRE4upFAG2hCZ1GBnzB';

// Cache exchange rates for 30 minutes
let exchangeRateCache = {
  rate: 0.88,
  timestamp: 0
};

const getExchangeRate = async () => {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  
  if (exchangeRateCache.timestamp && (now - exchangeRateCache.timestamp) < thirtyMinutes) {
    return exchangeRateCache.rate;
  }

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (response.ok) {
      const data = await response.json();
      if (data.rates && data.rates.CHF) {
        exchangeRateCache = {
          rate: data.rates.CHF,
          timestamp: now
        };
        return data.rates.CHF;
      }
    }
  } catch (error) {
    // Silent fail, use cached or default rate
  }
  
  return exchangeRateCache.rate || 0.88;
};

const fetchStockPrice = async (symbol) => {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && typeof data.c === 'number' && data.c > 0) {
      return data.c; // Current price in USD
    }
  } catch (error) {
    // Silent fail
  }
  return null;
};

const fetchCryptoPrice = async (cryptoId) => {
  try {
    const usdToChf = await getExchangeRate();
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&x_cg_demo_api_key=${COINGECKO_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      if (data[cryptoId] && data[cryptoId].usd) {
        return data[cryptoId].usd * usdToChf; // Convert to CHF
      }
    }
  } catch (error) {
    // Silent fail
  }
  return null;
};

const fetchMetalPrice = async (metalType) => {
  try {
    const usdToChf = await getExchangeRate();
    
    // Try gold-api.com first
    const url = `https://api.gold-api.com/price/${metalType}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      let metalPriceUsd = null;
      
      if (data.price) {
        metalPriceUsd = data.price;
      } else if (data.price_usd) {
        metalPriceUsd = data.price_usd;
      } else if (data[metalType]) {
        metalPriceUsd = data[metalType];
      }
      
      if (metalPriceUsd) {
        // Convert from USD per troy ounce to CHF per gram
        return (metalPriceUsd / 31.1035) * usdToChf;
      }
    }
  } catch (error) {
    // Silent fail
  }
  
  // Use fallback prices if API fails (updated Jan 2025)
  const fallbackPrices = {
    'XAU': 2650,  // Gold ~$2650/oz (Jan 2025)
    'XAG': 30,    // Silver ~$30/oz (Jan 2025)
    'XPT': 980,   // Platinum ~$980/oz (Jan 2025)
    'XPD': 950   // Palladium ~$950/oz (Jan 2025)
  };
  
  if (fallbackPrices[metalType]) {
    const usdToChf = await getExchangeRate();
    return (fallbackPrices[metalType] / 31.1035) * usdToChf;
  }
  
  return null;
};

export const updateAssetPrices = async (assets) => {
  const updatedAssets = [];
  const updatePromises = [];
  
  for (const asset of assets) {
    if (asset.type === 'stock' && asset.symbol && asset.quantity) {
      updatePromises.push(
        fetchStockPrice(asset.symbol).then(price => {
          if (price) {
            return {
              ...asset,
              value: price * asset.quantity,
              lastUpdated: new Date().toISOString()
            };
          }
          return null;
        })
      );
    } else if (asset.type === 'crypto' && asset.symbol && asset.quantity) {
      updatePromises.push(
        fetchCryptoPrice(asset.symbol).then(price => {
          if (price) {
            return {
              ...asset,
              value: price * asset.quantity,
              lastUpdated: new Date().toISOString()
            };
          }
          return null;
        })
      );
    } else if (asset.type === 'preciousMetal' && asset.metal_type && asset.quantity) {
      updatePromises.push(
        fetchMetalPrice(asset.metal_type).then(price => {
          if (price) {
            return {
              ...asset,
              value: price * asset.quantity,
              lastUpdated: new Date().toISOString()
            };
          }
          return null;
        })
      );
    } else {
      // For non-tradeable assets (bank accounts, etc.), keep as is
      updatePromises.push(Promise.resolve(asset));
    }
  }
  
  const results = await Promise.all(updatePromises);
  
  // Filter out nulls and return updated assets
  return results.filter(asset => asset !== null);
};

export const shouldUpdatePrices = (lastUpdate) => {
  if (!lastUpdate) return true;
  
  const now = Date.now();
  const lastUpdateTime = new Date(lastUpdate).getTime();
  const tenMinutes = 10 * 60 * 1000;
  
  return (now - lastUpdateTime) >= tenMinutes;
};