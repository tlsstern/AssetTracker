import React from 'react';
import './Card.css';

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

  return (
    <div className="card">
      <div className="card-header">Expenses by Category</div>
      <div className="card-body">
        <ul className="list-group">
          {Object.keys(expensesByCategory).map((category, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {category}
              <span className="badge bg-primary rounded-pill">${expensesByCategory[category].toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataOverview;