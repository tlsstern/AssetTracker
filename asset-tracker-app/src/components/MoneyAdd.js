import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Card.css';
import PriceFetcher from './PriceFetcher';
import Assets from './Assets';

const FINNHUB_API_KEY = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830';

const MoneyAdd = ({ onAddAsset, assets, onEditAsset, onDeleteAsset }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState('stock'); // 'stock' or 'crypto'
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMode, setInputMode] = useState('quantity'); // 'quantity' or 'value'
  const [fetchedPrice, setFetchedPrice] = useState(null);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        const fetchSymbols = async () => {
          let url = '';
          if (assetType === 'stock') {
            url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(searchQuery)}&token=${FINNHUB_API_KEY}`;
          } else if (assetType === 'crypto') {
            url = `https://finnhub.io/api/v1/crypto/symbol?exchange=BINANCE&token=${FINNHUB_API_KEY}`;
          }
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (assetType === 'stock') {
              if (data.result && Array.isArray(data.result)) {
                setSearchResults(data.result.filter(item => item.symbol && item.type !== 'ETF'));
              } else {
                setSearchResults([]);
              }
            } else if (assetType === 'crypto') {
              // For crypto, filter for symbols matching the search query
              if (Array.isArray(data)) {
                setSearchResults(data.filter(item => item.symbol && item.symbol.toLowerCase().includes(searchQuery.toLowerCase())));
              } else {
                setSearchResults([]);
              }
            }
          } catch (error) {
            setSearchResults([]);
          }
        };
        fetchSymbols();
      }, 500); // Debounce for 500ms
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, assetType]);

  const handlePriceFetched = useCallback((price) => {
    setFetchedPrice(price);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let assetValue = parseFloat(value);

    if (inputMode === 'quantity') {
      if (!name || !quantity || !fetchedPrice) return; // Ensure all necessary fields are present
      assetValue = parseFloat(quantity) * fetchedPrice;
    } else { // inputMode === 'value'
      if (!name || !value) return; // Ensure name and value are present
    }

    onAddAsset({ name, value: assetValue, quantity: parseFloat(quantity) });
    setName('');
    setValue('');
    setQuantity(1); // Reset quantity
    setSymbol('');
    setSearchQuery('');
    setSearchResults([]);
    setFetchedPrice(null);
  };

  const handleSymbolSelect = (selectedSymbol, selectedName) => {
    setSymbol(selectedSymbol);
    setName(selectedName);
    setSearchResults([]);
    setSearchQuery(selectedSymbol); // Keep the selected symbol in the search input
  };

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span role="img" aria-label="add" style={{ fontSize: 22 }}>➕</span>
          Manage Assets
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Asset Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}
                />
              </div>
              <div className="col">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inputModeOptions"
                    id="quantityMode"
                    value="quantity"
                    checked={inputMode === 'quantity'}
                    onChange={() => setInputMode('quantity')}
                  />
                  <label className="form-check-label" htmlFor="quantityMode">Quantity</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inputModeOptions"
                    id="valueMode"
                    value="value"
                    checked={inputMode === 'value'}
                    onChange={() => setInputMode('value')}
                  />
                  <label className="form-check-label" htmlFor="valueMode">Value</label>
                </div>
              </div>
            </div>

            {inputMode === 'quantity' ? (
              <div className="row g-3 mb-3">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}
                  />
                </div>
                <div className="col position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Symbol"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderRadius: 8, border: '1px solid #e0e7ff', marginBottom: searchResults.length > 0 ? 60 : 0 }}
                  />
                  {searchResults.length > 0 && (
                    <ul className="list-group position-absolute" style={{ zIndex: 1050, width: '90%', top: '110%' }}>
                      {searchResults.map((match, idx) => (
                        <li
                          key={match.symbol + idx}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSymbolSelect(match.symbol, match.description || match.displaySymbol || match.symbol)}
                          style={{ cursor: 'pointer', borderRadius: 8, marginBottom: 4 }}
                        >
                          <span role="img" aria-label="search" style={{ fontSize: 16, marginRight: 6 }}>🔍</span>
                          {match.symbol} - {match.description || match.displaySymbol || match.symbol} {match.type ? `(${match.type})` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <div className="text-muted position-absolute" style={{ zIndex: 1050, width: '90%', top: '110%', background: '#fff', borderRadius: 8, padding: 8, fontStyle: 'italic', border: '1px solid #e0e7ff' }}>
                      No results found.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="row g-3 mb-3">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}
                  />
                </div>
              </div>
            )}

            <div className="row g-3 mb-3">
              <div className="col">
                <select className="form-control" value={assetType} onChange={(e) => setAssetType(e.target.value)} style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}>
                  <option value="stock">Stock</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary" style={{ borderRadius: 8, padding: '8px 20px', fontWeight: 600, background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', border: 'none' }}>Add Asset</button>
              </div>
            </div>
          </form>
          {symbol && assetType && inputMode === 'quantity' && (
            <div className="mt-3">
              <PriceFetcher symbol={symbol} type={assetType} onPriceFetched={handlePriceFetched} />
            </div>
          )}
        </div>
      </div>
      <Assets assets={assets} onEditAsset={onEditAsset} onDeleteAsset={onDeleteAsset} />
    </div>
  );
};

export default MoneyAdd;
