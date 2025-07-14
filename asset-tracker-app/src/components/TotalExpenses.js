import React from 'react';

const TotalExpenses = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="card text-center">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span role="img" aria-label="expenses" style={{ fontSize: 22 }}>🧾</span>
        Total Expenses
      </div>
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: 36, fontWeight: 700, background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 0 }}>
          -CHF {totalExpenses.toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default TotalExpenses;
