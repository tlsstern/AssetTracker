import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Card.css';
import PriceFetcher from './PriceFetcher';
import Assets from './Assets';

const FINNHUB_API_KEY = 'c1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830';

const MoneyAdd = ({ onAddAsset, assets, onEditAsset, onDeleteAsset }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState('stock');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMode, setInputMode] = useState('quantity');
  const [fetchedPrice, setFetchedPrice] = useState(null);
  const [currency, setCurrency] = useState('CHF');
  const [accountType, setAccountType] = useState('Checking');
  const [limit, setLimit] = useState('');

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
            url = `https://finnhub.io/api/v1/crypto/symbol?exchange=US&token=${FINNHUB_API_KEY}`;
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
      }, 500);
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
    let assetToAdd = { name, value: assetValue, type: assetType };

    if (assetType === 'stock' || assetType === 'crypto' || assetType === 'gold') {
      if (inputMode === 'quantity') {
        if (!name || !quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity) };
      } else {
        if (!name || !value) return;
        assetToAdd = { ...assetToAdd, value: assetValue };
      }
    } else if (assetType === 'bankAccount') {
      assetToAdd = { ...assetToAdd, currency, accountType };
    } else if (assetType === 'card') {
      assetToAdd = { ...assetToAdd, limit: parseFloat(limit) };
    } else if (assetType === 'salary') {
      assetToAdd = { ...assetToAdd, income: parseFloat(value) };
    }


    onAddAsset(assetToAdd);
    setName('');
    setValue('');
    setQuantity(1);
    setSymbol('');
    setSearchQuery('');
    setSearchResults([]);
    setFetchedPrice(null);
    setCurrency('CHF');
    setAccountType('Checking');
    setLimit('');
  };

  const handleSymbolSelect = (selectedSymbol, selectedName) => {
    setSymbol(selectedSymbol);
    setName(selectedName);
    setSearchResults([]);
    setSearchQuery(selectedSymbol);
  };

  const buttonStyle = {
    borderRadius: 8,
    padding: '8px 20px',
    fontWeight: 600,
    background: '#687FE5',
    color: '#F3E2D4',
    border: 'none',
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
                <select className="form-control" value={assetType} onChange={(e) => setAssetType(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                  <option value="stock">Stock</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="bankAccount">Bank Account</option>
                  <option value="card">Card</option>
                  <option value="gold">Gold</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
            {(assetType === 'stock' || assetType === 'crypto' || assetType === 'gold') &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Asset Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
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
                        style={{ borderRadius: 8, border: 'none' }}
                      />
                    </div>
                    <div className="col position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Symbol"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: 8, border: 'none', marginBottom: 0 }}
                      />
                      {searchResults.length > 0 && (
                        <ul className="list-group position-absolute" style={{ zIndex: 1050, width: '100%', top: '110%', maxHeight: 220, overflowY: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: 'none', background: '#fff', marginBottom: 0 }}>
                          {searchResults.map((match, idx) => (
                            <li
                              key={match.symbol + idx}
                              className="list-group-item list-group-item-action"
                              onClick={() => handleSymbolSelect(match.symbol, match.description || match.displaySymbol || match.symbol)}
                              style={{ cursor: 'pointer', borderRadius: 8, marginBottom: 4, background: '#fff' }}
                            >
                              <span role="img" aria-label="search" style={{ fontSize: 16, marginRight: 6 }}>🔍</span>
                              {match.symbol} - {match.description || match.displaySymbol || match.symbol} {match.type ? `(${match.type})` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                      {searchQuery.length > 1 && searchResults.length === 0 && (
                        <div className="text-muted position-absolute" style={{ zIndex: 1050, width: '100%', top: '110%', background: '#fff', borderRadius: 8, padding: 8, fontStyle: 'italic', border: 'none', marginBottom: 0 }}>
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
                        style={{ borderRadius: 8, border: 'none' }}
                      />
                    </div>
                  </div>
                )}
              </>
            }
            {assetType === 'bankAccount' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Account Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Balance"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <select className="form-control" value={accountType} onChange={(e) => setAccountType(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                    </select>
                  </div>
                </div>
              </>
            }
            {assetType === 'card' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Card Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Balance"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Limit"
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                </div>
              </>
            }

            {assetType === 'salary' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Job Title"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Monthly Income"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                </div>
              </>
            }

            <div className="row g-3 mb-3">
              <div className="col-auto">
                <button type="submit" className="btn" style={buttonStyle}>Add Asset</button>
              </div>
            </div>
          </form>
          {symbol && (assetType === 'stock' || assetType === 'crypto' || assetType === 'gold') && inputMode === 'quantity' && (
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