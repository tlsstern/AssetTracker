import React from 'react';

const Networth = ({ networth }) => {
  return (
    <div className="card text-center">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span role="img" aria-label="networth" style={{ fontSize: 22 }}>💼</span>
        Net Worth
      </div>
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: 36, fontWeight: 700, background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 0 }}>
          CHF {networth.toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default Networth;
