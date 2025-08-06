import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Card.css';
import PriceFetcher from './PriceFetcher';
import Assets from './Assets';

const FINNHUB_API_KEY = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830';

const MoneyAdd = ({ onAddAsset, assets, onEditAsset, onDeleteAsset, onTransfer }) => {
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
  const [destinationAccount, setDestinationAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [metalType, setMetalType] = useState('XAU');


  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (assetType === 'preciousMetal') {
      const metalNameMap = {
        'XAU': 'Gold',
        'XAG': 'Silver',
        'XPT': 'Platinum',
        'XPD': 'Palladium'
      };
      setName(metalNameMap[metalType]);
    } else {
      // Reset name when switching away from precious metals, unless user has typed something
      if (!searchQuery && !symbol) {
         setName('');
      }
    }
  }, [assetType, metalType, searchQuery, symbol]);


  useEffect(() => {
    if (searchQuery.length > 1 && (assetType === 'stock' || assetType === 'crypto')) {
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

    if (assetType === 'stock' || assetType === 'crypto') {
      if (inputMode === 'quantity') {
        if (!name || !quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity) };
      } else {
        if (!name || !value) return;
        assetToAdd = { ...assetToAdd, value: assetValue };
      }
    } else if (assetType === 'preciousMetal') {
        if (!quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity), metal_type: metalType };
    } else if (assetType === 'bankAccount') {
      assetToAdd = { ...assetToAdd, currency, account_type: accountType };
    } else if (assetType === 'salary') {
      assetToAdd = { ...assetToAdd, income: parseFloat(value), destination_account: destinationAccount };
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
    setDestinationAccount('');
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (fromAccount && toAccount && transferAmount > 0) {
      onTransfer(fromAccount, toAccount, parseFloat(transferAmount));
      setFromAccount('');
      setToAccount('');
      setTransferAmount('');
    }
  }

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
                  <option value="preciousMetal">Precious Metal</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>
            {(assetType === 'stock' || assetType === 'crypto') &&
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
                        min="0.01"
                        step="0.01"
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
            {assetType === 'preciousMetal' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <select className="form-control" value={metalType} onChange={(e) => setMetalType(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                      <option value="XAU">Gold</option>
                      <option value="XAG">Silver</option>
                      <option value="XPT">Platinum</option>
                      <option value="XPD">Palladium</option>
                    </select>
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity (grams)"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0.01"
                      step="0.01"
                      style={{ borderRadius: 8, border: 'none' }}
                    />
                  </div>
                </div>
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
                  <div className="col">
                    <select className="form-control" value={destinationAccount} onChange={(e) => setDestinationAccount(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                      <option value="">Select Account</option>
                      {assets.filter(asset => asset.type === 'bankAccount').map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
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
          {symbol && (assetType === 'stock' || assetType === 'crypto') && inputMode === 'quantity' && (
            <div className="mt-3">
              <PriceFetcher 
                symbol={symbol} 
                type={assetType} 
                onPriceFetched={handlePriceFetched}
                quantity={quantity || 1}
              />
            </div>
          )}
          {assetType === 'preciousMetal' && (
            <div className="mt-3">
              <PriceFetcher 
                symbol={metalType} 
                type={assetType} 
                onPriceFetched={handlePriceFetched} 
                quantity={quantity || 1} 
              />
            </div>
          )}
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header">Transfer Money</div>
        <div className="card-body">
          <form onSubmit={handleTransferSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col">
                <select className="form-control" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                  <option value="">From Account</option>
                  {assets.filter(asset => asset.type === 'bankAccount').map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <select className="form-control" value={toAccount} onChange={(e) => setToAccount(e.target.value)} style={{ borderRadius: 8, border: 'none' }}>
                  <option value="">To Account</option>
                  {assets.filter(asset => asset.type === 'bankAccount').map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  style={{ borderRadius: 8, border: 'none' }}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn" style={buttonStyle}>Transfer</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Assets assets={assets} onEditAsset={onEditAsset} onDeleteAsset={onDeleteAsset} />
    </div>
  );
};

export default MoneyAdd;