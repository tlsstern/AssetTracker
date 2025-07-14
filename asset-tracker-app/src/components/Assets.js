import React from 'react';

const Assets = ({ assets }) => {
  return (
    <div className="card">
      <div className="card-header">Assets</div>
      <div className="card-body">
        <ul className="list-group mb-3">
          {assets.map((asset, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {asset.name}
              <span className="badge bg-primary rounded-pill">${asset.value.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Assets;
