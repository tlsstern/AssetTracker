import React, { useState } from 'react';
import './Card.css';

const Expenses = ({ onAddExpense, expenses }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    onAddExpense({ name, value: parseFloat(value), category });
    setName('');
    setValue('');
    setCategory('Food');
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">Add Expense</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Expense Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}
                />
              </div>
              <div className="col">
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} style={{ borderRadius: 8, border: '1px solid #e0e7ff' }}>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Housing</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary" style={{ borderRadius: 8, padding: '8px 20px', fontWeight: 600, background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', border: 'none' }}>Add Expense</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Expenses</div>
        <div className="card-body">
          {expenses.length === 0 ? (
            <div className="text-muted" style={{ fontStyle: 'italic' }}>No expenses yet. Start tracking your spending!</div>
          ) : (
            <ul className="list-group mb-3">
              {expenses.map((expense, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', background: 'transparent', padding: '14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label="expense" style={{ fontSize: 20, marginRight: 8 }}>💸</span>
                    <span style={{ fontWeight: 500 }}>{expense.name}</span>
                    <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: '1px solid #e0e7ff' }}>{expense.category}</span>
                  </div>
                  <span className="badge bg-danger rounded-pill" style={{ fontSize: 16, padding: '8px 16px', background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)', color: '#fff', fontWeight: 600 }}>
                    -CHF {expense.value.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
