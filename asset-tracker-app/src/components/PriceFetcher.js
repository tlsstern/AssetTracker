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
          // Try multiple approaches for crypto prices
          const symbolUpper = symbol.toUpperCase();
          
          // First try direct quote endpoint for crypto
          url = `https://finnhub.io/api/v1/quote?symbol=${symbolUpper}&token=${finnhubApiKey}`;
          let response = await fetch(url);
          let data = await response.json();
          
          if (data && typeof data.c === 'number' && data.c > 0) {
            fetchedPrice = data.c;
          } else {
            // Try with BINANCE exchange prefix
            url = `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${symbolUpper}USDT&resolution=D&count=1&token=${finnhubApiKey}`;
            response = await fetch(url);
            data = await response.json();
            
            if (data && data.c && data.c.length > 0) {
              fetchedPrice = data.c[data.c.length - 1];
            } else {
              // Try alternative exchange prefixes
              const exchanges = ['COINBASE', 'KRAKEN', 'GEMINI'];
              for (const exchange of exchanges) {
                url = `https://finnhub.io/api/v1/crypto/candle?symbol=${exchange}:${symbolUpper}USD&resolution=D&count=1&token=${finnhubApiKey}`;
                response = await fetch(url);
                data = await response.json();
                
                if (data && data.c && data.c.length > 0) {
                  fetchedPrice = data.c[data.c.length - 1];
                  console.log(`Found crypto price on ${exchange}`);
                  break;
                }
              }
              
              if (!fetchedPrice) {
                // Use fallback to free crypto API
                try {
                  const fallbackUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbolUpper.toLowerCase()}&vs_currencies=usd`;
                  const fallbackResponse = await fetch(fallbackUrl);
                  if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    const coinId = symbolUpper.toLowerCase();
                    if (fallbackData[coinId] && fallbackData[coinId].usd) {
                      fetchedPrice = fallbackData[coinId].usd;
                      console.log(`Using CoinGecko price for ${symbol}`);
                    }
                  }
                } catch (err) {
                  console.warn('CoinGecko fallback failed:', err);
                }
                
                if (!fetchedPrice) {
                  // Try common crypto symbol to CoinGecko ID mapping
                  const symbolMapping = {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'BNB': 'binancecoin',
                    'XRP': 'ripple',
                    'ADA': 'cardano',
                    'DOGE': 'dogecoin',
                    'SOL': 'solana',
                    'DOT': 'polkadot',
                    'MATIC': 'matic-network',
                    'AVAX': 'avalanche-2',
                    'LINK': 'chainlink',
                    'UNI': 'uniswap',
                    'ATOM': 'cosmos',
                    'LTC': 'litecoin',
                    'BCH': 'bitcoin-cash'
                  };
                  
                  const coinId = symbolMapping[symbolUpper];
                  if (coinId) {
                    try {
                      const mappedUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
                      const mappedResponse = await fetch(mappedUrl);
                      if (mappedResponse.ok) {
                        const mappedData = await mappedResponse.json();
                        if (mappedData[coinId] && mappedData[coinId].usd) {
                          fetchedPrice = mappedData[coinId].usd;
                          console.log(`Using mapped CoinGecko price for ${symbol}`);
                        }
                      }
                    } catch (err) {
                      console.warn('CoinGecko mapped fallback failed:', err);
                    }
                  }
                  
                  if (!fetchedPrice) {
                    setError('Could not fetch crypto price. Try common symbols like BTC, ETH, BNB, etc.');
                  }
                }
              }
            }
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
            console.log(`${symbol} price: $${metalPriceUsd}/oz = CHF ${fetchedPrice.toFixed(2)}/gram`);
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
      <p>Price: CHF {totalPrice.toFixed(2)}</p>
    );
  }
  
  return (
    <p>Current Price: CHF {parseFloat(price).toFixed(2)}</p>
  );
};

export default PriceFetcher;