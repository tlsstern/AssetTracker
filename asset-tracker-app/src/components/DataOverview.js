import React from 'react';
import { Pie } from 'react-chartjs-2';
import './Card.css';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const DataOverview = ({ expenses }) => {
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

  const expensesByCategory = getExpensesByCategory();

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
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
            <Pie data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataOverview;
