import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
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

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [networth, setNetworth] = useState(0);

  const getAssets = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('assets').select('*').eq('user_id', session.user.id);
    setAssets(data || []);
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

  useEffect(() => {
    if (session) {
      getAssets();
      getTransactions();
    }
  }, [session, getAssets, getTransactions]);

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
      if (asset.type === 'salary' && asset.destination_account) {
        const account = assets.find(a => a.id === asset.destination_account);
        if (account) {
          const updatedAccount = { ...account, value: account.value + asset.income };
          await editAsset(assets.findIndex(a => a.id === asset.destination_account), updatedAccount);
        }
      }
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
      <Route
        path="/*"
        element={
          session ? (
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">Asset Tracker</h1>
                <Link to="/settings" className="settings-link">
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
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
      <Route path="/verify" element={!session ? <Verify /> : <Navigate to="/" />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </Routes>
  );
}

export default App;
