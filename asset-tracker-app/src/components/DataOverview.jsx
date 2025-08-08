import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import './Card.css';
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

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Assets by Type
            </div>
            <div className="card-body">
              {Object.keys(assetsByType).length === 0 ? (
                <div className="text-muted" style={{ fontStyle: 'italic' }}>No assets to display. Add some assets to see the chart!</div>
              ) : (
                <div style={{ height: '400px', background: 'rgba(99,102,241,0.04)', borderRadius: 18, boxShadow: '0 2px 8px rgba(99,102,241,0.06)', padding: 16 }}>
                  <Pie data={assetsData} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Expenses by Category
            </div>
            <div className="card-body">
              {Object.keys(transactionsByCategory.expenses).length === 0 ? (
                <div className="text-muted" style={{ fontStyle: 'italic' }}>No expenses to display. Add some expenses to see the chart!</div>
              ) : (
                <div style={{ height: '400px', background: 'rgba(99,102,241,0.04)', borderRadius: 18, boxShadow: '0 2px 8px rgba(99,102,241,0.06)', padding: 16 }}>
                  <Bar data={expensesData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Income by Category
            </div>
            <div className="card-body">
              {Object.keys(transactionsByCategory.income).length === 0 ? (
                <div className="text-muted" style={{ fontStyle: 'italic' }}>No income to display. Add some income to see the chart!</div>
              ) : (
                <div style={{ height: '400px', background: 'rgba(99,102,241,0.04)', borderRadius: 18, boxShadow: '0 2px 8px rgba(99,102,241,0.06)', padding: 16 }}>
                  <Bar data={incomeData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;