import React, { useState } from 'react';
import './Card.css';

const Transactions = ({ onAddTransaction, transactions, onEditTransaction, onDeleteTransaction, assets }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [account, setAccount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');

  // State for handling the inline editing
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', value: '', category: '', date: '', transactionType: 'expense', isRecurring: false, recurringFrequency: 'monthly' });

  const expenseCategories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Gift', 'Investment', 'Refund', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value || !date || !category) return;
    
    const transaction = {
      name,
      value: parseFloat(value),
      category,
      date,
      transaction_type: transactionType,
      account_id: account,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? recurringFrequency : null
    };
    
    onAddTransaction(transaction);
    setName('');
    setValue('');
    setCategory('');
    setDate(new Date().toISOString().slice(0, 10));
    setAccount('');
    setTransactionType('expense');
    setIsRecurring(false);
    setRecurringFrequency('monthly');
  };

  // Handlers for starting, changing, and saving an edit
  const startEdit = (index, transaction) => {
    setEditIndex(index);
    setEditData({
      name: transaction.name,
      value: transaction.value,
      category: transaction.category,
      date: transaction.date,
      transactionType: transaction.transaction_type || 'expense',
      isRecurring: transaction.is_recurring || false,
      recurringFrequency: transaction.recurring_frequency || 'monthly'
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({ ...editData, [name]: type === 'checkbox' ? checked : value });
  };

  const saveEdit = (index) => {
    onEditTransaction(index, {
      ...editData,
      value: parseFloat(editData.value),
      transaction_type: editData.transactionType,
      is_recurring: editData.isRecurring,
      recurring_frequency: editData.isRecurring ? editData.recurringFrequency : null
    });
    setEditIndex(null);
  };

  const buttonStyle = {
    borderRadius: 8,
    fontWeight: 600,
    background: '#687FE5',
    color: '#F3E2D4',
    border: 'none',
  };

  const outlineButtonStyle = {
    borderRadius: 8,
    fontWeight: 600,
    background: 'transparent',
    color: '#687FE5',
    border: '1px solid #687FE5',
  };

  const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div>
      <div className="card">
        <div className="card-header">Add Transaction</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-2">
                <select 
                  className="form-control" 
                  value={transactionType} 
                  onChange={(e) => {
                    setTransactionType(e.target.value);
                    setCategory(''); // Reset category when switching type
                  }} 
                  style={{ borderRadius: 8, border: 'none' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={transactionType === 'expense' ? 'What did you spend on?' : 'Where did money come from?'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: 8, border: 'none' }}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  style={{ borderRadius: 8, border: 'none' }}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ borderRadius: 8, border: 'none' }}
                />
              </div>
              <div className="col-md-2">
                <select 
                  className="form-control" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  style={{ borderRadius: 8, border: 'none' }}
                >
                  <option value="">Category</option>
                  {currentCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row g-3 mb-3 align-items-center">
              <div className="col-md-3">
                <select 
                  className="form-control" 
                  value={account} 
                  onChange={(e) => setAccount(e.target.value)} 
                  style={{ borderRadius: 8, border: 'none' }}
                >
                  <option value="">Select Account</option>
                  {assets.filter(asset => asset.type === 'bankAccount').map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="recurringCheck"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="recurringCheck">
                    Recurring
                  </label>
                </div>
              </div>
              {isRecurring && (
                <div className="col-md-2">
                  <select 
                    className="form-control" 
                    value={recurringFrequency} 
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                    style={{ borderRadius: 8, border: 'none' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
              <div className="col-md text-end">
                <button type="submit" className="btn" style={buttonStyle}>Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">Transactions List</div>
        <div className="card-body">
          {transactions.length === 0 ? (
            <div className="text-muted" style={{ fontStyle: 'italic' }}>No transactions yet. Start tracking your income and expenses!</div>
          ) : (
            <ul className="list-group mb-3">
              {transactions.map((transaction, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', background: 'transparent', padding: '14px 0' }}>
                  {editIndex === index ? (
                    <>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexGrow: 1 }}>
                        <span role="img" aria-label="transaction" style={{ fontSize: 20, marginRight: 8 }}>
                          {editData.transactionType === 'expense' ? '💸' : '💰'}
                        </span>
                        <select 
                          name="transactionType" 
                          value={editData.transactionType} 
                          onChange={handleEditChange} 
                          className="form-control form-control-sm"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                        <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="form-control form-control-sm" placeholder="Name" />
                        <input type="number" name="value" value={editData.value} onChange={handleEditChange} className="form-control form-control-sm" placeholder="Value" style={{ width: '100px' }} />
                        <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="form-control form-control-sm" />
                        <select name="category" value={editData.category} onChange={handleEditChange} className="form-control form-control-sm">
                          {(editData.transactionType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="form-check form-check-sm">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isRecurring"
                            checked={editData.isRecurring}
                            onChange={handleEditChange}
                          />
                          <label className="form-check-label">
                            Recurring
                          </label>
                        </div>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className="btn btn-sm" style={buttonStyle} onClick={() => saveEdit(index)}>Save</button>
                        <button className="btn btn-sm" style={outlineButtonStyle} onClick={() => setEditIndex(null)}>Cancel</button>
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span role="img" aria-label="transaction" style={{ fontSize: 20, marginRight: 8 }}>
                          {transaction.transaction_type === 'expense' ? '💸' : '💰'}
                        </span>
                        <div>
                          <span style={{ fontWeight: 500 }}>{transaction.name}</span>
                          <div>
                            <span className="badge bg-light text-secondary me-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>{transaction.category}</span>
                            <span className="badge bg-light text-secondary me-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>{transaction.date}</span>
                            {transaction.is_recurring && (
                              <span className="badge bg-light text-secondary" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>
                                {transaction.recurring_frequency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span 
                          className="badge rounded-pill" 
                          style={{ 
                            fontSize: 16, 
                            padding: '8px 16px', 
                            background: transaction.transaction_type === 'expense' ? '#dc3545' : '#28a745', 
                            color: '#F3E2D4', 
                            fontWeight: 600 
                          }}
                        >
                          {transaction.transaction_type === 'expense' ? '-' : '+'} CHF {transaction.value.toFixed(2)}
                        </span>
                        <button className="btn btn-sm" style={outlineButtonStyle} onClick={() => startEdit(index, transaction)}>Edit</button>
                        <button className="btn btn-sm" style={outlineButtonStyle} onClick={() => onDeleteTransaction(index)}>Delete</button>
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

export default Transactions;