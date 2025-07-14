import React from 'react';

const TotalExpenses = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="card text-center">
      <div className="card-header">Total Expenses</div>
      <div className="card-body">
        <h2 className="card-title">-${totalExpenses.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default TotalExpenses;
