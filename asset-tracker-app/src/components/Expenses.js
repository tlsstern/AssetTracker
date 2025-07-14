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
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Expense Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="col">
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Housing</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">Add Expense</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Expenses</div>
        <div className="card-body">
          <ul className="list-group mb-3">
            {expenses.map((expense, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {expense.name}
                  <span className="badge bg-secondary ms-2">{expense.category}</span>
                </div>
                <span className="badge bg-danger rounded-pill">-${expense.value.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
