import React, { useState } from 'react';
import './Transactions.css';
import { formatCHF } from '../utils/formatters';
import { icons } from '../constants/styles';

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

  const currentCategories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="transactions-container">
      <div className="add-transaction-form">
        <div className="form-header">Add Transaction</div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <select 
              className="form-select" 
              value={transactionType} 
              onChange={(e) => {
                setTransactionType(e.target.value);
                setCategory('');
              }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input 
              type="text" 
              className="form-input" 
              placeholder={transactionType === 'expense' ? 'What did you spend on?' : 'Where did money come from?'}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="number" 
              className="form-input" 
              placeholder="Amount" 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              required 
              min={0} 
              step={0.01} 
            />
            <select 
              className="form-select" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
            >
              <option value="">Category</option>
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type="date" 
              className="form-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
            <select 
              className="form-select" 
              value={account} 
              onChange={(e) => setAccount(e.target.value)}
            >
              <option value="">Select Account</option>
              {assets.filter(asset => asset.type === 'bankAccount').map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
            <div className="form-checkbox-wrapper">
              <input
                className="form-checkbox"
                type="checkbox"
                id="recurringCheck"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              <label className="form-checkbox-label" htmlFor="recurringCheck">
                Recurring
              </label>
            </div>
            {isRecurring && (
              <select 
                className="form-select" 
                value={recurringFrequency} 
                onChange={(e) => setRecurringFrequency(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
            <button type="submit" className="btn-add-transaction">Add Transaction</button>
          </div>
        </form>
      </div>

      <div className="transactions-list-container">
        <div className="form-header">Transactions List</div>
        {transactions.length === 0 ? (
          <div className="no-transactions">No transactions yet. Start tracking your income and expenses!</div>
        ) : (
          <ul className="transactions-list">
            {transactions.map((transaction, index) => (
              <li key={index} className="transaction-item">
                {editIndex === index ? (
                  <div className="edit-mode">
                    <div className="edit-inputs">
                      <span className="transaction-icon">
                        {editData.transactionType === 'expense' ? icons.expense : icons.income}
                      </span>
                      <select 
                        name="transactionType" 
                        value={editData.transactionType} 
                        onChange={handleEditChange} 
                        className="edit-select"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                      <input 
                        type="text" 
                        name="name" 
                        value={editData.name} 
                        onChange={handleEditChange} 
                        className="edit-input" 
                        placeholder="Name" 
                      />
                      <input 
                        type="number" 
                        name="value" 
                        value={editData.value} 
                        onChange={handleEditChange} 
                        className="edit-input" 
                        placeholder="Value" 
                        style={{ width: '100px' }} 
                      />
                      <input 
                        type="date" 
                        name="date" 
                        value={editData.date} 
                        onChange={handleEditChange} 
                        className="edit-input" 
                      />
                      <select 
                        name="category" 
                        value={editData.category} 
                        onChange={handleEditChange} 
                        className="edit-select"
                      >
                        {(editData.transactionType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="form-checkbox-wrapper">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          name="isRecurring"
                          checked={editData.isRecurring}
                          onChange={handleEditChange}
                        />
                        <label className="form-checkbox-label">
                          Recurring
                        </label>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <button className="btn-save-transaction" onClick={() => saveEdit(index)}>Save</button>
                      <button className="btn-cancel-transaction" onClick={() => setEditIndex(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="transaction-info">
                      <span className="transaction-icon">
                        {transaction.transaction_type === 'expense' ? icons.expense : icons.income}
                      </span>
                      <div className="transaction-details">
                        <span className="transaction-name">{transaction.name}</span>
                        <div className="transaction-meta">
                          <span className="transaction-badge">{transaction.category}</span>
                          <span className="transaction-badge">{transaction.date}</span>
                          {transaction.is_recurring && (
                            <span className="transaction-badge recurring">
                              {transaction.recurring_frequency}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="transaction-value-section">
                      <span className={`transaction-value ${transaction.transaction_type}`}>
                        {transaction.transaction_type === 'expense' ? '-' : '+'} {formatCHF(transaction.value)}
                      </span>
                      <div className="transaction-actions">
                        <button className="btn-edit-transaction" onClick={() => startEdit(index, transaction)}>Edit</button>
                        <button className="btn-delete-transaction" onClick={() => onDeleteTransaction(index)}>Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;