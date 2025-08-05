import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import DataOverview from './components/DataOverview';
import MoneyAdd from './components/MoneyAdd';
import Login from './components/Login'; // Import the new Login component
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [networth, setNetworth] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const { data } = await supabase.from('assets').select('*');
    setAssets(data || []);
  };

  const getExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*');
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
    else getAssets(); // Refresh assets
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
    else getExpenses(); // Refresh expenses
  };

  const deleteExpense = async (index) => {
    const expenseToDelete = expenses[index];
    const { error } = await supabase.from('expenses').delete().eq('id', expenseToDelete.id);
    if (error) console.error('Error deleting expense:', error);
    else setExpenses(expenses.filter((_, i) => i !== index));
  };

  if (!session) {
    return <Login />; // Use the new Login component
  }

  return (
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
        </Routes>
      </div>
    </div>
  );
}

export default App;