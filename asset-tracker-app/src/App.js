// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import DataOverview from './components/DataOverview';
import MoneyAdd from './components/MoneyAdd';
import Login from './components/Login';
import Verify from './components/Verify';
import UpdatePassword from './components/UpdatePassword';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [networth, setNetworth] = useState(0);

  const getAssets = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('assets').select('*').eq('user_id', session.user.id);
    setAssets(data || []);
  }, [session]);

  const getExpenses = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from('expenses').select('*').eq('user_id', session.user.id);
    setExpenses(data || []);
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
      getExpenses();
    }
  }, [session, getAssets, getExpenses]);

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
    if (error) {
      console.error('Error adding asset:', error);
    } else {
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

  const addExpense = async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: session.user.id }])
      .select();
    if (error) {
      console.error('Error adding expense:', error);
    } else {
      if (expense.source_account) {
        const account = assets.find(a => a.id === expense.source_account);
        if (account) {
          const updatedAccount = { ...account, value: account.value - expense.value };
          await editAsset(assets.findIndex(a => a.id === expense.source_account), updatedAccount);
        }
      }
      getExpenses();
    }
  };

  const editAsset = async (index, updatedAsset) => {
    const assetToUpdate = assets[index];
    const { data, error } = await supabase
      .from('assets')
      .update(updatedAsset)
      .eq('id', assetToUpdate.id);
    if (error) {
      console.error('Error updating asset:', error);
    } else {
      getAssets();
    }
  };

  const deleteAsset = async (index) => {
    const assetToDelete = assets[index];
    const { error } = await supabase.from('assets').delete().eq('id', assetToDelete.id);
    if (error) {
      console.error('Error deleting asset:', error);
    } else {
      getAssets();
    }
  };

  const editExpense = async (index, updatedExpense) => {
    const expenseToUpdate = expenses[index];
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedExpense)
      .eq('id', expenseToUpdate.id);
    if (error) {
      console.error('Error updating expense:', error);
    } else {
      getExpenses();
    }
  };

  const deleteExpense = async (index) => {
    const expenseToDelete = expenses[index];
    const { error } = await supabase.from('expenses').delete().eq('id', expenseToDelete.id);
    if (error) {
      console.error('Error deleting expense:', error);
    } else {
      getExpenses();
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
                  <Route path="/" element={<Dashboard networth={networth} assets={assets} expenses={expenses} onEditAsset={editAsset} onDeleteAsset={deleteAsset} />} />
                  <Route path="/expenses" element={<Expenses onAddExpense={addExpense} expenses={expenses} onEditExpense={editExpense} onDeleteExpense={deleteExpense} assets={assets} />} />
                  <Route path="/overview" element={<DataOverview assets={assets} expenses={expenses} />} />
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
