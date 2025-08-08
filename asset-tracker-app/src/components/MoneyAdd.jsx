import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Card.css';
import PriceFetcher from './PriceFetcher.jsx';
import Assets from './Assets.jsx';
import SearchableDropdown from './SearchableDropdown.jsx';
import { buttonStyles } from '../constants/styles';

const FINNHUB_API_KEY = 'd1qbte9r01qrh89pd82gd1qbte9r01qrh89pd830';
const COINGECKO_API_KEY = 'CG-R4jRckRE4upFAG2hCZ1GBnzB';

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
  const [accountType, setAccountType] = useState('Checking');
  const [limit, setLimit] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [metalType, setMetalType] = useState('XAU');
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [cryptoSearch, setCryptoSearch] = useState('');
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false);
  const [loadingCryptos, setLoadingCryptos] = useState(false);


  const searchTimeoutRef = useRef(null);
  const cryptoDropdownRef = useRef(null);

  // Fetch top 100 cryptocurrencies from CoinGecko
  useEffect(() => {
    const fetchCryptoList = async () => {
      if (assetType === 'crypto' && cryptoList.length === 0) {
        setLoadingCryptos(true);
        try {
          const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${COINGECKO_API_KEY}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setCryptoList(data);
          }
        } catch (error) {
        } finally {
          setLoadingCryptos(false);
        }
      }
    };
    fetchCryptoList();
  }, [assetType, cryptoList.length]);

  // Close crypto dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cryptoDropdownRef.current && !cryptoDropdownRef.current.contains(event.target)) {
        setShowCryptoDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (assetType === 'preciousMetal') {
      const metalNameMap = {
        'XAU': 'Gold',
        'XAG': 'Silver',
        'XPT': 'Platinum',
        'XPD': 'Palladium'
      };
      setName(metalNameMap[metalType]);
    } else if (assetType === 'crypto' && selectedCrypto) {
      const crypto = cryptoList.find(c => c.id === selectedCrypto);
      if (crypto) {
        setName(crypto.name);
        setSymbol(crypto.id);
      }
    } else {
      // Reset name when switching away from precious metals, unless user has typed something
      if (!searchQuery && !symbol) {
         setName('');
      }
    }
  }, [assetType, metalType, searchQuery, symbol, selectedCrypto, cryptoList]);


  useEffect(() => {
    if (searchQuery.length > 1 && assetType === 'stock') {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        const fetchSymbols = async () => {
          const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(searchQuery)}&token=${FINNHUB_API_KEY}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.result && Array.isArray(data.result)) {
              setSearchResults(data.result.filter(item => item.symbol && item.type !== 'ETF'));
            } else {
              setSearchResults([]);
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

    if (assetType === 'stock') {
      if (inputMode === 'quantity') {
        if (!name || !quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity) };
      } else {
        if (!name || !value) return;
        assetToAdd = { ...assetToAdd, value: assetValue };
      }
    } else if (assetType === 'crypto') {
      if (inputMode === 'quantity') {
        if (!selectedCrypto || !quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity) };
      } else {
        if (!selectedCrypto || !value) return;
        const crypto = cryptoList.find(c => c.id === selectedCrypto);
        if (crypto) {
          assetToAdd = { ...assetToAdd, name: crypto.name, value: assetValue };
        }
      }
    } else if (assetType === 'preciousMetal') {
        if (!quantity || !fetchedPrice) return;
        assetValue = parseFloat(quantity) * fetchedPrice;
        assetToAdd = { ...assetToAdd, value: assetValue, quantity: parseFloat(quantity), metal_type: metalType };
    } else if (assetType === 'bankAccount') {
      assetToAdd = { ...assetToAdd, currency: 'CHF', account_type: accountType };
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
    setAccountType('Checking');
    setLimit('');
    setDestinationAccount('');
    setSelectedCrypto('');
    setCryptoSearch('');
    setShowCryptoDropdown(false);
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
            {assetType === 'stock' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Stock Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Stock name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Input Method</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className="btn"
                        style={{
                          borderRadius: '8px 0 0 8px',
                          backgroundColor: inputMode === 'quantity' ? '#687FE5' : '#f8f9fa',
                          color: inputMode === 'quantity' ? '#F3E2D4' : '#666',
                          border: 'none',
                          padding: '8px 16px'
                        }}
                        onClick={() => setInputMode('quantity')}
                      >
                        By Quantity
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          borderRadius: '0 8px 8px 0',
                          backgroundColor: inputMode === 'value' ? '#687FE5' : '#f8f9fa',
                          color: inputMode === 'value' ? '#F3E2D4' : '#666',
                          border: 'none',
                          padding: '8px 16px'
                        }}
                        onClick={() => setInputMode('value')}
                      >
                        By Value
                      </button>
                    </div>
                  </div>
                </div>

                {inputMode === 'quantity' ? (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Number of Shares</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0.01"
                        step="0.01"
                        style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                    <div className="col-md-6 position-relative">
                      <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Stock Symbol</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search stock symbol"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                      />
                      {searchResults.length > 0 && (
                        <div className="position-absolute" style={{ 
                          zIndex: 1050, 
                          width: '100%', 
                          top: 'calc(100% + 4px)', 
                          maxHeight: 280, 
                          overflowY: 'auto', 
                          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', 
                          borderRadius: 8,
                          background: '#fff'
                        }}>
                          {searchResults.map((match, idx) => (
                            <div
                              key={match.symbol + idx}
                              className="px-3 py-2"
                              onClick={() => handleSymbolSelect(match.symbol, match.description || match.displaySymbol || match.symbol)}
                              style={{ 
                                cursor: 'pointer', 
                                borderBottom: idx < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                                fontSize: '14px'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{match.symbol}</strong>
                                  <div className="text-muted" style={{ fontSize: '12px' }}>
                                    {match.description || match.displaySymbol || match.symbol}
                                  </div>
                                </div>
                                {match.type && (
                                  <span className="badge bg-light text-secondary" style={{ fontSize: '11px' }}>
                                    {match.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Total Value (CHF)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  </div>
                )}
              </>
            }
            {assetType === 'crypto' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col">
                    <div className="position-relative" ref={cryptoDropdownRef}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={loadingCryptos ? "Loading cryptocurrencies..." : "Search cryptocurrency by name or symbol..."}
                        value={cryptoSearch}
                        onChange={(e) => {
                          setCryptoSearch(e.target.value);
                          setShowCryptoDropdown(true);
                        }}
                        onFocus={() => setShowCryptoDropdown(true)}
                        disabled={loadingCryptos}
                        style={{ borderRadius: 8, border: 'none', paddingRight: selectedCrypto ? '100px' : '12px' }}
                      />
                      {selectedCrypto && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '4px 8px',
                            fontSize: '12px',
                            borderRadius: 6,
                            background: '#e0e0e0',
                            border: 'none'
                          }}
                          onClick={() => {
                            setSelectedCrypto('');
                            setCryptoSearch('');
                            setName('');
                            setSymbol('');
                          }}
                        >
                          Clear
                        </button>
                      )}
                      {showCryptoDropdown && cryptoSearch && !loadingCryptos && (
                        <div
                          className="position-absolute"
                          style={{
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: 8,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            zIndex: 1050,
                            marginTop: 4
                          }}
                        >
                          {cryptoList
                            .filter(crypto => 
                              crypto.name.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
                              crypto.symbol.toLowerCase().includes(cryptoSearch.toLowerCase())
                            )
                            .slice(0, 10)
                            .map((crypto) => (
                              <div
                                key={crypto.id}
                                className="px-3 py-2"
                                style={{
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f0f0f0',
                                  fontSize: '14px'
                                }}
                                onClick={() => {
                                  setSelectedCrypto(crypto.id);
                                  setCryptoSearch(`${crypto.name} (${crypto.symbol.toUpperCase()})`);
                                  setShowCryptoDropdown(false);
                                  setName(crypto.name);
                                  setSymbol(crypto.id);
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>#{crypto.market_cap_rank}</strong> {crypto.name}
                                  </div>
                                  <div className="text-muted">
                                    {crypto.symbol.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          {cryptoList.filter(crypto => 
                            crypto.name.toLowerCase().includes(cryptoSearch.toLowerCase()) ||
                            crypto.symbol.toLowerCase().includes(cryptoSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-3 py-2 text-muted">
                              No cryptocurrencies found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
                        min="0.00000001"
                        step="0.00000001"
                        style={{ borderRadius: 8, border: 'none' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Value (CHF)"
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
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Metal Type</label>
                    <div className="position-relative">
                      <select 
                        className="form-control" 
                        value={metalType} 
                        onChange={(e) => setMetalType(e.target.value)} 
                        style={{ 
                          borderRadius: 8, 
                          border: 'none', 
                          backgroundColor: '#f8f9fa',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          appearance: 'none',
                          paddingRight: '30px'
                        }}
                      >
                        <option value="XAU">Gold</option>
                        <option value="XAG">Silver</option>
                        <option value="XPT">Platinum</option>
                        <option value="XPD">Palladium</option>
                      </select>
                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#666'
                      }}>
                        ▼
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter amount in grams"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0.01"
                      step="0.01"
                      style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                </div>
              </>
            }
            {assetType === 'bankAccount' &&
              <>
                <div className="row g-3 align-items-end mb-3">
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Account Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Account name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Balance (CHF)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" style={{ fontSize: '13px', marginBottom: '4px', color: '#666' }}>Account Type</label>
                    <select 
                      className="form-control" 
                      value={accountType} 
                      onChange={(e) => setAccountType(e.target.value)} 
                      style={{ borderRadius: 8, border: 'none', backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                    >
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
          {symbol && assetType === 'stock' && inputMode === 'quantity' && (
            <div className="mt-3">
              <PriceFetcher 
                symbol={symbol} 
                type={assetType} 
                onPriceFetched={handlePriceFetched}
                quantity={quantity || 1}
              />
            </div>
          )}
          {selectedCrypto && assetType === 'crypto' && inputMode === 'quantity' && (
            <div className="mt-3">
              <PriceFetcher 
                symbol={selectedCrypto} 
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