import React from 'react';
import { formatCHF } from '../utils/formatters';

const TotalExpenses = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="card text-center">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span role="img" aria-label="expenses" style={{ fontSize: 22 }}>🧾</span>
        Total Expenses
      </div>
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: 36, fontWeight: 500, color: '#212529', marginBottom: 0 }}>
          {formatCHF(totalExpenses)}
        </h2>
      </div>
    </div>
  );
};

export default TotalExpenses;