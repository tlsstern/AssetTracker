import React, { useState, useEffect } from 'react';

const PriceFetcher = ({ symbol, type, onPriceFetched }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      let url = '';
      const apiKey = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830'; // Finnhub API Key

      try {
        let fetchedPrice = null;
        if (type === 'stock') {
          // Finnhub stock quote endpoint
          url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          // Finnhub returns { c: current price, ... }
          if (data && typeof data.c === 'number') {
            fetchedPrice = data.c;
          } else {
            setError('Could not fetch price. Invalid symbol or API limit reached.');
          }
        } else if (type === 'crypto') {
          // Finnhub crypto quote endpoint (symbol format: BINANCE:BTCUSDT)
          // We'll try with BINANCE:SYMBOLUSDT
          url = `https://finnhub.io/api/v1/crypto/price?symbol=BINANCE:${symbol}USDT&token=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          // Finnhub returns { price: ... }
          if (data && typeof data.price === 'number') {
            fetchedPrice = data.price;
          } else {
            setError('Could not fetch price. Invalid symbol or API limit reached.');
          }
        }
        setPrice(fetchedPrice);
        onPriceFetched(fetchedPrice);
      } catch (err) {
        setError('Error fetching data.');
        onPriceFetched(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [symbol, type, onPriceFetched]);

  if (loading) return <p>Loading price...</p>;
  if (error) return <p>Error: {error}</p>;
  if (price == null) return <p>Price not available.</p>;

  return (
    <p>Current Price: CHF {parseFloat(price).toFixed(2)}</p>
  );
};

export default PriceFetcher;