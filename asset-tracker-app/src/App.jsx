import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Transactions from './components/Transactions.jsx';
import DataOverview from './components/DataOverview.jsx';
import MoneyAdd from './components/MoneyAdd.jsx';
import Login from './components/Login.jsx';
import Verify from './components/Verify.jsx';
import UpdatePassword from './components/UpdatePassword.jsx';
import Settings from './components/Settings.jsx';
import { supabase } from './supabaseClient';
import { updateAssetPrices, shouldUpdatePrices } from './services/priceUpdateService';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [networth, setNetworth] = useState(0);
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const priceUpdateIntervalRef = useRef(null);

  const getAssets = useCallback(async (skipPriceUpdate = false) => {
    if (!session) return;
    const { data } = await supabase.from('assets').select('*').eq('user_id', session.user.id);
    const assetsData = data || [];
    setAssets(assetsData);
    return assetsData;
  }, [session]);

  const getTransactions = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('transactions').select('*').eq('user_id', session.user.id);
    setTransactions(data || []);
  }, [session]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updatePrices = async (assetsToUpdate = null) => {
    if (isUpdatingPrices) return;
    
    setIsUpdatingPrices(true);
    
    try {
      // Get fresh assets from database if not provided
      let currentAssets = assetsToUpdate;
      if (!currentAssets) {
        const { data } = await supabase
          .from('assets')
          .select('*')
          .eq('user_id', session?.user?.id);
        currentAssets = data || [];
      }
      
      if (currentAssets.length === 0) {
        setIsUpdatingPrices(false);
        return;
      }
      
      const updatedAssets = await updateAssetPrices(currentAssets);
      
      // Update assets in database and state
      for (const updatedAsset of updatedAssets) {
        if (updatedAsset.lastUpdated) {
          await supabase
            .from('assets')
            .update({ 
              value: updatedAsset.value,
              last_price_update: updatedAsset.lastUpdated 
            })
            .eq('id', updatedAsset.id);
        }
      }
      
      setAssets(updatedAssets);
      setLastPriceUpdate(new Date().toISOString());
    } catch (error) {
      // Silent fail, keep existing prices
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  useEffect(() => {
    if (session) {
      getAssets().then(assetsData => {
        // Update prices on initial load if we have assets
        if (assetsData && assetsData.length > 0 && shouldUpdatePrices(lastPriceUpdate)) {
          setTimeout(() => updatePrices(assetsData), 2000);
        }
      });
      getTransactions();
    }
  }, [session, getAssets, getTransactions]);

  // Set up automatic price updates every 10-15 minutes
  useEffect(() => {
    if (session && assets.length > 0) {
      // Clear existing interval
      if (priceUpdateIntervalRef.current) {
        clearInterval(priceUpdateIntervalRef.current);
      }
      
      // Set up new interval (12 minutes to be in the middle of 10-15)
      priceUpdateIntervalRef.current = setInterval(() => {
        updatePrices();
      }, 12 * 60 * 1000); // 12 minutes
      
      return () => {
        if (priceUpdateIntervalRef.current) {
          clearInterval(priceUpdateIntervalRef.current);
        }
      };
    }
  }, [session, assets.length]);

  useEffect(() => {
    const calculateNetworth = () => {
      const totalAssets = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
      // Expenses are not subtracted from net worth directly, but from bank accounts
      setNetworth(totalAssets);
    };
    calculateNetworth();
  }, [assets]);

  const addAsset = async (asset) => {
    const { data, error } = await supabase
      .from('assets')
      .insert([{ ...asset, user_id: session.user.id }])
      .select();
    if (!error) {
      getAssets();
    }
  };

  const addTransaction = async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: session.user.id }])
      .select();
    if (!error) {
      if (transaction.account_id) {
        const account = assets.find(a => a.id === transaction.account_id);
        if (account) {
          const valueChange = transaction.transaction_type === 'expense' ? -transaction.value : transaction.value;
          const updatedAccount = { ...account, value: account.value + valueChange };
          await editAsset(assets.findIndex(a => a.id === transaction.account_id), updatedAccount);
        }
      }
      getTransactions();
    }
  };

  const editAsset = async (index, updatedAsset) => {
    const assetToUpdate = assets[index];
    const { data, error } = await supabase
      .from('assets')
      .update(updatedAsset)
      .eq('id', assetToUpdate.id);
    if (!error) {
      getAssets();
    }
  };

  const deleteAsset = async (index) => {
    const assetToDelete = assets[index];
    const { error } = await supabase.from('assets').delete().eq('id', assetToDelete.id);
    if (!error) {
      getAssets();
    }
  };

  const editTransaction = async (index, updatedTransaction) => {
    const transactionToUpdate = transactions[index];
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedTransaction)
      .eq('id', transactionToUpdate.id);
    if (!error) {
      getTransactions();
    }
  };

  const deleteTransaction = async (index) => {
    const transactionToDelete = transactions[index];
    const { error } = await supabase.from('transactions').delete().eq('id', transactionToDelete.id);
    if (!error) {
      getTransactions();
    }
  };

  const handleTransfer = async (fromAccountId, toAccountId, amount) => {
    const fromAccount = assets.find(a => a.id === fromAccountId);
    const toAccount = assets.find(a => a.id === toAccountId);

    if (fromAccount && toAccount && amount > 0 && fromAccount.value >= amount) {
      const updatedFromAccount = { ...fromAccount, value: fromAccount.value - amount };
      const updatedToAccount = { ...toAccount, value: toAccount.value + amount };

      await editAsset(assets.indexOf(fromAccount), updatedFromAccount);
      await editAsset(assets.indexOf(toAccount), updatedToAccount);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/verify" element={!session ? <Verify /> : <Navigate to="/dashboard" />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route
        path="/dashboard/*"
        element={
          session ? (
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">AssetTracker</h1>
                <Link to="/dashboard/settings" className="settings-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51-1z"></path>
                  </svg>
                </Link>
              </header>
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/" element={<Dashboard networth={networth} assets={assets} transactions={transactions} onEditAsset={editAsset} onDeleteAsset={deleteAsset} />} />
                  <Route path="/transactions" element={<Transactions onAddTransaction={addTransaction} transactions={transactions} onEditTransaction={editTransaction} onDeleteTransaction={deleteTransaction} assets={assets} />} />
                  <Route path="/overview" element={<DataOverview assets={assets} transactions={transactions} />} />
                  <Route path="/add" element={<MoneyAdd onAddAsset={addAsset} assets={assets} onEditAsset={editAsset} onDeleteAsset={deleteAsset} onTransfer={handleTransfer} />} />
                  <Route path="/settings" element={<Settings onUpdatePrices={updatePrices} isUpdatingPrices={isUpdatingPrices} lastPriceUpdate={lastPriceUpdate} />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
