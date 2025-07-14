import React, { useState } from 'react';
import './Card.css';

const MoneyAdd = ({ onAddAsset }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) return;
    onAddAsset({ name, value: parseFloat(value) });
    setName('');
    setValue('');
  };

  return (
    <div className="card">
      <div className="card-header">Add Asset</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Asset Name"
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
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">Add Asset</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoneyAdd;