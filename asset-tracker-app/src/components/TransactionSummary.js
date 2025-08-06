import React from 'react';
import { formatCHF } from '../utils/formatters';

const TransactionSummary = ({ transactions }) => {
  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense' || !t.transaction_type)
    .reduce((sum, transaction) => sum + transaction.value, 0);
  
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, transaction) => sum + transaction.value, 0);
  
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="card text-center">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span role="img" aria-label="net flow" style={{ fontSize: 22 }}>💵</span>
        Net Flow
      </div>
      <div className="card-body">
        <h2 className="card-title" style={{ 
          fontSize: 36, 
          fontWeight: 500, 
          color: netFlow >= 0 ? '#28a745' : '#dc3545', 
          marginBottom: 0 
        }}>
          {netFlow >= 0 ? '' : '-'}{formatCHF(Math.abs(netFlow))}
        </h2>
      </div>
    </div>
  );
};

export default TransactionSummary;