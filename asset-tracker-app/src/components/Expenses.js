import React, { useState } from 'react';
import './Card.css';

const Expenses = ({ onAddExpense, expenses, onEditExpense, onDeleteExpense }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // State for handling the inline editing
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', value: '', category: '', date: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value || !date) return;
    onAddExpense({ name, value: parseFloat(value), category, date });
    setName('');
    setValue('');
    setCategory('Food');
    setDate(new Date().toISOString().slice(0, 10));
  };

  // Handlers for starting, changing, and saving an edit
  const startEdit = (index, expense) => {
    setEditIndex(index);
    setEditData({
      name: expense.name,
      value: expense.value,
      category: expense.category,
      date: expense.date,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = (index) => {
    onEditExpense(index, {
      ...editData,
      value: parseFloat(editData.value),
    });
    setEditIndex(null);
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
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
        <div className="card-header">Expenses List</div>
        <div className="card-body">
          {expenses.length === 0 ? (
            <div className="text-muted" style={{ fontStyle: 'italic' }}>No expenses yet. Start tracking your spending!</div>
          ) : (
            <ul className="list-group mb-3">
              {expenses.map((expense, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', background: 'transparent', padding: '14px 0' }}>
                  {editIndex === index ? (
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexGrow: 1 }}>
                        <span role="img" aria-label="expense" style={{ fontSize: 20, marginRight: 8 }}>💸</span>
                        <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="form-control form-control-sm" placeholder="Name" />
                        <input type="number" name="value" value={editData.value} onChange={handleEditChange} className="form-control form-control-sm" placeholder="Value" style={{width: '100px'}} />
                        <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="form-control form-control-sm" />
                        <select name="category" value={editData.category} onChange={handleEditChange} className="form-control form-control-sm">
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Housing</option>
                            <option>Entertainment</option>
                            <option>Other</option>
                        </select>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button className="btn btn-success btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => saveEdit(index)}>Save</button>
                          <button className="btn btn-secondary btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => setEditIndex(null)}>Cancel</button>
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span role="img" aria-label="expense" style={{ fontSize: 20, marginRight: 8 }}>💸</span>
                        <div>
                          <span style={{ fontWeight: 500 }}>{expense.name}</span>
                          <div>
                            <span className="badge bg-light text-secondary me-2" style={{ fontWeight: 400, fontSize: 13, border: '1px solid #e0e7ff' }}>{expense.category}</span>
                            <span className="badge bg-light text-secondary" style={{ fontWeight: 400, fontSize: 13, border: '1px solid #e0e7ff' }}>{expense.date}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: 16, padding: '8px 16px', background: 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)', color: '#fff', fontWeight: 600 }}>
                          CHF {expense.value.toFixed(2)}
                        </span>
                        <button className="btn btn-outline-primary btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => startEdit(index, expense)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => onDeleteExpense(index)}>Delete</button>
                      </span>
                    </>
                  )}
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