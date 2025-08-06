import React, { useState, useEffect } from 'react';
import { formatCHF, formatSwissNumber } from '../utils/formatters';

const PriceFetcher = ({ symbol, type, onPriceFetched, quantity = 1 }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      let url = '';
      const finnhubApiKey = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830'; // Finnhub API Key
      const goldApiKey = 'goldapi-f9k20712k4dveo-io'; // Gold API Key
      const coingeckoApiKey = 'CG-R4jRckRE4upFAG2hCZ1GBnzB'; // CoinGecko API Key

      try {
        let fetchedPrice = null;
        if (type === 'stock') {
          url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data && typeof data.c === 'number') {
            fetchedPrice = data.c;
          } else {
            setError('Could not fetch price. Invalid symbol or API limit reached.');
          }
        } else if (type === 'crypto') {
          // Use CoinGecko API with the provided API key
          // symbol should be the CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')
          try {
            // First, get USD to CHF exchange rate
            let usdToChf = 0.88; // Default fallback rate
            try {
              const exchangeUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
              const exchangeResponse = await fetch(exchangeUrl);
              if (exchangeResponse.ok) {
                const exchangeData = await exchangeResponse.json();
                if (exchangeData.rates && exchangeData.rates.CHF) {
                  usdToChf = exchangeData.rates.CHF;
                  console.log('USD to CHF rate:', usdToChf);
                }
              }
            } catch (exchangeErr) {
              console.warn('Could not fetch exchange rate, using default:', exchangeErr);
            }

            // Fetch crypto price from CoinGecko
            url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&x_cg_demo_api_key=${coingeckoApiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`CoinGecko API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data[symbol] && data[symbol].usd) {
              // Convert USD price to CHF
              fetchedPrice = data[symbol].usd * usdToChf;
              console.log(`${symbol} price: $${data[symbol].usd} = CHF ${formatSwissNumber(fetchedPrice)}`);
            } else {
              setError('Cryptocurrency not found. Please select from the available list.');
            }
          } catch (err) {
            console.error('Error fetching crypto price:', err);
            setError('Could not fetch cryptocurrency price.');
          }
        } else if (type === 'preciousMetal') {
          // First, get USD to CHF exchange rate using a free API
          let usdToChf = 0.88; // Default fallback rate
          try {
            const exchangeUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
            const exchangeResponse = await fetch(exchangeUrl);
            if (exchangeResponse.ok) {
              const exchangeData = await exchangeResponse.json();
              if (exchangeData.rates && exchangeData.rates.CHF) {
                usdToChf = exchangeData.rates.CHF;
                console.log('USD to CHF rate:', usdToChf);
              }
            }
          } catch (exchangeErr) {
            console.warn('Could not fetch exchange rate, using default:', exchangeErr);
          }
          
          // Try multiple sources for precious metal prices
          let metalPriceUsd = null;
          
          // First try gold-api.com (as per git commit)
          try {
            url = `https://api.gold-api.com/price/${symbol}`;
            const response = await fetch(url);
            
            if (response.ok) {
              const data = await response.json();
              console.log('gold-api.com response:', data);
              
              // Handle various possible response formats
              if (data.price) {
                metalPriceUsd = data.price;
              } else if (data.price_usd) {
                metalPriceUsd = data.price_usd;
              } else if (data[symbol]) {
                metalPriceUsd = data[symbol];
              }
            }
          } catch (err) {
            console.warn('gold-api.com failed:', err);
          }
          
          // If gold-api.com failed, try alternative API
          if (!metalPriceUsd) {
            try {
              // Try metals-api.com (free tier available)
              const metalSymbolMap = {
                'XAU': 'gold',
                'XAG': 'silver',
                'XPT': 'platinum',
                'XPD': 'palladium'
              };
              
              const metalName = metalSymbolMap[symbol] || symbol.toLowerCase();
              
              // Try using exchange rate API for metal prices (some provide commodity prices)
              const commodityUrl = `https://api.exchangerate-api.com/v4/latest/USD`;
              const commodityResponse = await fetch(commodityUrl);
              
              if (!commodityResponse.ok) {
                throw new Error('Could not fetch commodity prices');
              }
            } catch (err) {
              console.warn('Alternative metal API failed:', err);
            }
          }
          
          // Use fallback prices if API calls failed
          if (!metalPriceUsd) {
            const fallbackPrices = {
              'XAU': 2050,  // Gold ~$2050/oz
              'XAG': 24,    // Silver ~$24/oz
              'XPT': 970,   // Platinum ~$970/oz
              'XPD': 1050   // Palladium ~$1050/oz
            };
            
            if (fallbackPrices[symbol]) {
              metalPriceUsd = fallbackPrices[symbol];
              console.log(`Using fallback price for ${symbol}: $${metalPriceUsd}/oz`);
              setError('Using approximate price. Live data may be unavailable.');
            }
          }
          
          if (metalPriceUsd) {
            // Convert from USD per troy ounce to CHF per gram
            fetchedPrice = (metalPriceUsd / 31.1035) * usdToChf;
            console.log(`${symbol} price: $${metalPriceUsd}/oz = CHF ${formatSwissNumber(fetchedPrice)}/gram`);
          } else {
            setError('Could not fetch precious metal price.');
          }
        }
        setPrice(fetchedPrice);
        onPriceFetched(fetchedPrice);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data.');
        onPriceFetched(null);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
        fetchPrice();
    }
  }, [symbol, type, onPriceFetched, quantity]);

  if (loading) return <p>Loading price...</p>;
  if (error) return <p>Error: {error}</p>;
  if (price == null) return <p>Price not available.</p>;

  // Display total price based on quantity for all asset types when quantity is provided
  if (quantity > 0) {
    const totalPrice = parseFloat(price) * parseFloat(quantity);
    return (
      <p>Price: {formatCHF(totalPrice)}</p>
    );
  }
  
  return (
    <p>Current Price: {formatCHF(parseFloat(price))}</p>
  );
};

export default PriceFetcher;