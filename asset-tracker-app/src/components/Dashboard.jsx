import React from 'react';
import Networth from './Networth.jsx';
import Assets from './Assets.jsx';
import TransactionSummary from './TransactionSummary.jsx';
import './Dashboard.css';

function Dashboard({ networth, assets, transactions, onEditAsset, onDeleteAsset }) {
  const totalAssets = assets.length;
  const recentTransactions = transactions.slice(-5).reverse();
  const monthlyChange = calculateMonthlyChange(assets, transactions);

  function calculateMonthlyChange(assets, transactions) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.created_at) >= lastMonth
    );
    
    const income = monthlyTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
    const expenses = monthlyTransactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
    
    return income - expenses;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Track your financial journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Net Worth</p>
            <h2 className="stat-value">${networth.toLocaleString()}</h2>
            <p className="stat-change positive">
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toLocaleString()} this month
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Assets</p>
            <h2 className="stat-value">{totalAssets}</h2>
            <p className="stat-change neutral">Active investments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Monthly Change</p>
            <h2 className="stat-value">${Math.abs(monthlyChange).toLocaleString()}</h2>
            <p className={`stat-change ${monthlyChange >= 0 ? 'positive' : 'negative'}`}>
              {monthlyChange >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <p className="stat-label">Transactions</p>
            <h2 className="stat-value">{transactions.length}</h2>
            <p className="stat-change neutral">Total recorded</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <div className="section-card">
            <div className="section-header">
              <h3>Your Assets</h3>
              <span className="badge">{assets.length} items</span>
            </div>
            <Assets assets={assets} onEditAsset={onEditAsset} onDeleteAsset={onDeleteAsset} />
          </div>
        </div>

        <div className="content-right">
          <div className="section-card">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <span className="badge">Last 5</span>
            </div>
            <TransactionSummary transactions={recentTransactions} />
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-label">Highest Asset</span>
                <span className="quick-stat-value">
                  ${assets.length > 0 ? Math.max(...assets.map(a => a.value)).toLocaleString() : '0'}
                </span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">Average Asset Value</span>
                <span className="quick-stat-value">
                  ${assets.length > 0 ? Math.round(networth / assets.length).toLocaleString() : '0'}
                </span>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-label">Portfolio Health</span>
                <span className="quick-stat-value positive">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;