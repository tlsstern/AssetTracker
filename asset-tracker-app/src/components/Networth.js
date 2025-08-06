import React from 'react';
import { formatCHF } from '../utils/formatters';

const Networth = ({ networth }) => {
  return (
    <div className="card text-center">
      <div className="card-header">
        Net Worth
      </div>
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: 36, fontWeight: 500, color: '#212529', marginBottom: 0 }}>
          {formatCHF(networth)}
        </h2>
      </div>
    </div>
  );
};

export default Networth;