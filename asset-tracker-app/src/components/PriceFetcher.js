import React, { useState, useEffect } from 'react';

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
          url = `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${symbol}USDT&resolution=D&count=1&token=${finnhubApiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.c && data.c.length > 0) {
            fetchedPrice = data.c[data.c.length - 1];
          } else {
            setError('Could not fetch price. Invalid symbol or API limit reached.');
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
          
          // Try gold-api.com first (as per git commit)
          try {
            url = `https://api.gold-api.com/price/${symbol}`;
            const response = await fetch(url);
            
            if (response.ok) {
              const data = await response.json();
              console.log('gold-api.com response:', data);
              
              // Handle various possible response formats
              let priceInUsd = null;
              
              if (data.price) {
                priceInUsd = data.price;
              } else if (data.price_usd) {
                priceInUsd = data.price_usd;
              } else if (data[symbol]) {
                priceInUsd = data[symbol];
              }
              
              if (priceInUsd) {
                // Convert from USD per troy ounce to CHF per gram
                fetchedPrice = (priceInUsd / 31.1035) * usdToChf;
                console.log(`${symbol} price: $${priceInUsd}/oz = CHF ${fetchedPrice.toFixed(2)}/gram`);
              } else {
                throw new Error('Unexpected response format from gold-api.com');
              }
            } else {
              throw new Error(`gold-api.com returned status ${response.status}`);
            }
          } catch (err) {
            console.warn('gold-api.com failed:', err);
            
            // Fallback to approximate prices
            const fallbackPrices = {
              'XAU': 2050,  // Gold
              'XAG': 24,    // Silver  
              'XPT': 970,   // Platinum
              'XPD': 1050   // Palladium
            };
            
            if (fallbackPrices[symbol]) {
              const metalPrice = fallbackPrices[symbol];
              fetchedPrice = (metalPrice / 31.1035) * usdToChf;
              console.log(`Using fallback price for ${symbol}: $${metalPrice}/oz = CHF ${fetchedPrice.toFixed(2)}/gram`);
              setError('Using approximate price. Live data unavailable.');
            } else {
              setError('Could not fetch precious metal price.');
            }
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
      <p>Price: CHF {totalPrice.toFixed(2)}</p>
    );
  }
  
  return (
    <p>Current Price: CHF {parseFloat(price).toFixed(2)}</p>
  );
};

export default PriceFetcher;