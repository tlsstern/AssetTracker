import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import './Card.css';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DataOverview = ({ assets, expenses }) => {
  const getAssetsByType = () => {
    const assetsByType = {};
    assets.forEach(asset => {
      if (assetsByType[asset.type]) {
        assetsByType[asset.type] += asset.value;
      } else {
        assetsByType[asset.type] = asset.value;
      }
    });
    return assetsByType;
  };

  const getExpensesByCategory = () => {
    const expensesByCategory = {};
    expenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.value;
      } else {
        expensesByCategory[expense.category] = expense.value;
      }
    });
    return expensesByCategory;
  };

  const assetsByType = getAssetsByType();
  const expensesByCategory = getExpensesByCategory();

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
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(expensesByCategory),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span role="img" aria-label="chart" style={{ fontSize: 22 }}>📊</span>
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
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span role="img" aria-label="chart" style={{ fontSize: 22 }}>📊</span>
            Expenses by Category
          </div>
          <div className="card-body">
            {Object.keys(expensesByCategory).length === 0 ? (
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
  );
};

export default DataOverview;