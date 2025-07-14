
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import DataOverview from './components/DataOverview';
import MoneyAdd from './components/MoneyAdd';

function App() {
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [networth, setNetworth] = useState(0);

  useEffect(() => {
    const calculateNetworth = () => {
      const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
      setNetworth(totalAssets - totalExpenses);
    };
    calculateNetworth();
  }, [assets, expenses]);

  const addAsset = (asset) => {
    setAssets([...assets, asset]);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Asset Tracker</h1>
      </header>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard networth={networth} assets={assets} expenses={expenses} />} />
          <Route path="/expenses" element={<Expenses onAddExpense={addExpense} expenses={expenses} />} />
          <Route path="/overview" element={<DataOverview expenses={expenses} />} />
          <Route path="/add" element={<MoneyAdd onAddAsset={addAsset} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

