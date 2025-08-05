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
      const finnhubApiKey = 'c1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830'; // Finnhub API Key
      const goldApiKey = 'goldapi-x-hIozk2fS1aJtW-io'; // Gold API Key

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
        } else if (type === 'gold') {
          url = `https://www.goldapi.io/api/XAU/CHF`;
          const response = await fetch(url, {
            headers: {
              'x-access-token': goldApiKey
            }
          });
          const data = await response.json();
          if (data && data.price) {
            fetchedPrice = data.price;
          } else {
            setError('Could not fetch gold price.');
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