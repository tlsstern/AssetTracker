import React from 'react';

const Networth = ({ networth }) => {
  return (
    <div className="card text-center">
      <div className="card-header">Net Worth</div>
      <div className="card-body">
        <h2 className="card-title">${networth.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Networth;
