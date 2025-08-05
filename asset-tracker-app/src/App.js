import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import DataOverview from './components/DataOverview';
import MoneyAdd from './components/MoneyAdd';
import Login from './components/Login';
import Verify from './components/Verify'; // Import the new Verify component
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [networth, setNetworth] = useState(0);

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
  }, [session]);
  
  useEffect(() => {
    const calculateNetworth = () => {
      const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
      setNetworth(totalAssets - totalExpenses);
    };
    calculateNetworth();
  }, [assets, expenses]);

  const getAssets = async () => {
    if(!session) return;
    const { data } = await supabase.from('assets').select('*').eq('user_id', session.user.id);
    setAssets(data || []);
  };

  const getExpenses = async () => {
    if(!session) return;
    const { data } = await supabase.from('expenses').select('*').eq('user_id', session.user.id);
    setExpenses(data || []);
  };

  const addAsset = async (asset) => {
    const { data, error } = await supabase
      .from('assets')
      .insert([{ ...asset, user_id: session.user.id }])
      .select();
    if (error) console.error('Error adding asset:', error);
    else setAssets(prev => [...prev, ...data]);
  };

  const addExpense = async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: session.user.id }])
      .select();
    if (error) console.error('Error adding expense:', error);
    else setExpenses(prev => [...prev, ...data]);
  };

  const editAsset = async (index, updatedAsset) => {
    const assetToUpdate = assets[index];
    const { data, error } = await supabase
      .from('assets')
      .update(updatedAsset)
      .eq('id', assetToUpdate.id);
    if (error) console.error('Error updating asset:', error);
    else getAssets();
  };

  const deleteAsset = async (index) => {
    const assetToDelete = assets[index];
    const { error } = await supabase.from('assets').delete().eq('id', assetToDelete.id);
    if (error) console.error('Error deleting asset:', error);
    else setAssets(assets.filter((_, i) => i !== index));
  };

  const editExpense = async (index, updatedExpense) => {
    const expenseToUpdate = expenses[index];
    const { data, error } = await supabase
      .from('expenses')
      .update(updatedExpense)
      .eq('id', expenseToUpdate.id);
    if (error) console.error('Error updating expense:', error);
    else getExpenses();
  };

  const deleteExpense = async (index) => {
    const expenseToDelete = expenses[index];
    const { error } = await supabase.from('expenses').delete().eq('id', expenseToDelete.id);
    if (error) console.error('Error deleting expense:', error);
    else setExpenses(expenses.filter((_, i) => i !== index));
  };
  
  if (loading) {
    return null; // Or a loading spinner
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
              </header>
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/" element={<Dashboard networth={networth} assets={assets} expenses={expenses} onEditAsset={editAsset} onDeleteAsset={deleteAsset} />} />
                  <Route path="/expenses" element={<Expenses onAddExpense={addExpense} expenses={expenses} onEditExpense={editExpense} onDeleteExpense={deleteExpense}/>} />
                  <Route path="/overview" element={<DataOverview expenses={expenses} />} />
                  <Route path="/add" element={<MoneyAdd onAddAsset={addAsset} assets={assets} onEditAsset={editAsset} onDeleteAsset={deleteAsset} />} />
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
    </Routes>
  );
}

export default App;