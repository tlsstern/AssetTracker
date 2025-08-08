import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import './DataOverview.css';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DataOverview = ({ assets, transactions }) => {
  // Format asset type names for display
  const formatAssetType = (type) => {
    const typeMap = {
      'stock': 'Stocks',
      'crypto': 'Cryptocurrency',
      'bankAccount': 'Bank Accounts',
      'preciousMetal': 'Precious Metals',
      'card': 'Credit Cards'
    };
    return typeMap[type] || type;
  };

  const getAssetsByType = () => {
    const assetsByType = {};
    assets.forEach(asset => {
      const formattedType = formatAssetType(asset.type);
      if (assetsByType[formattedType]) {
        assetsByType[formattedType] += asset.value;
      } else {
        assetsByType[formattedType] = asset.value;
      }
    });
    return assetsByType;
  };

  const getTransactionsByCategory = () => {
    const transactionsByCategory = { income: {}, expenses: {} };
    transactions.forEach(transaction => {
      const type = transaction.transaction_type === 'income' ? 'income' : 'expenses';
      if (transactionsByCategory[type][transaction.category]) {
        transactionsByCategory[type][transaction.category] += transaction.value;
      } else {
        transactionsByCategory[type][transaction.category] = transaction.value;
      }
    });
    return transactionsByCategory;
  };

  const assetsByType = getAssetsByType();
  const transactionsByCategory = getTransactionsByCategory();

  const assetsData = {
    labels: Object.keys(assetsByType),
    datasets: [
      {
        data: Object.values(assetsByType),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  const expensesData = {
    labels: Object.keys(transactionsByCategory.expenses),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(transactionsByCategory.expenses),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const incomeData = {
    labels: Object.keys(transactionsByCategory.income),
    datasets: [
      {
        label: 'Income by Category',
        data: Object.values(transactionsByCategory.income),
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate portfolio insights and tips
  const getPortfolioInsights = () => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalExpenses = Object.values(transactionsByCategory.expenses).reduce((sum, val) => sum + val, 0);
    const totalIncome = Object.values(transactionsByCategory.income).reduce((sum, val) => sum + val, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
    
    // Asset diversity score (0-100)
    const assetTypes = Object.keys(assetsByType).length;
    const diversityScore = Math.min(100, assetTypes * 20);
    
    // Risk assessment
    const highRiskValue = assets
      .filter(a => a.type === 'crypto' || a.type === 'stock')
      .reduce((sum, a) => sum + a.value, 0);
    const riskRatio = totalValue > 0 ? (highRiskValue / totalValue * 100) : 0;
    
    // Monthly average
    const monthlyAvg = transactions.length > 0 ? 
      (totalExpenses / Math.max(1, new Set(transactions.map(t => t.date?.substring(0, 7))).size)) : 0;

    return {
      labels: ['Savings Rate %', 'Diversity Score', 'Risk Level %', 'Monthly Avg Expense'],
      data: [
        Math.round(savingsRate),
        diversityScore,
        Math.round(riskRatio),
        Math.round(monthlyAvg)
      ]
    };
  };

  const insights = getPortfolioInsights();
  const insightsData = {
    labels: insights.labels,
    datasets: [
      {
        label: 'Portfolio Health Metrics',
        data: insights.data,
        backgroundColor: [
          'rgba(139, 92, 246, 0.2)',
          'rgba(236, 72, 153, 0.2)',
          'rgba(251, 146, 60, 0.2)',
          'rgba(14, 165, 233, 0.2)'
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="data-overview-container">
      <div className="chart-grid">
        <div className="chart-container">
          <div className="chart-title">Assets by Type</div>
          {Object.keys(assetsByType).length === 0 ? (
            <div className="no-data">No assets to display. Add some assets to see the chart!</div>
          ) : (
            <div className="chart-wrapper">
              <Pie data={assetsData} />
            </div>
          )}
        </div>
        
        <div className="chart-container">
          <div className="chart-title">Expenses by Category</div>
          {Object.keys(transactionsByCategory.expenses).length === 0 ? (
            <div className="no-data">No expenses to display. Add some expenses to see the chart!</div>
          ) : (
            <div className="chart-wrapper">
              <Bar data={expensesData} />
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-grid bottom-row">
        <div className="chart-container">
          <div className="chart-title">Income by Category</div>
          {Object.keys(transactionsByCategory.income).length === 0 ? (
            <div className="no-data">No income to display. Add some income to see the chart!</div>
          ) : (
            <div className="chart-wrapper">
              <Bar data={incomeData} />
            </div>
          )}
        </div>
        
        <div className="chart-container">
          <div className="chart-title">Portfolio Health Insights</div>
          {assets.length === 0 && transactions.length === 0 ? (
            <div className="no-data">Add assets and transactions to see portfolio insights!</div>
          ) : (
            <div className="chart-wrapper">
              <Bar 
                data={insightsData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label;
                          const value = context.raw;
                          if (label.includes('%')) return `${value}%`;
                          if (label.includes('Monthly')) return `CHF ${value.toLocaleString()}`;
                          return `Score: ${value}/100`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataOverview;