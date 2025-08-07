import React from 'react';
import Networth from './Networth';
import Assets from './Assets';
import TransactionSummary from './TransactionSummary';
import './Card.css';

function Dashboard({ networth, assets, transactions, onEditAsset, onDeleteAsset }) {
  return (
    <div>
      <div className="stats-container">
        <Networth networth={networth} />
        <TransactionSummary transactions={transactions} />
      </div>
      <Assets assets={assets} onEditAsset={onEditAsset} onDeleteAsset={onDeleteAsset} />
    </div>
  );
}

export default Dashboard;