import React from 'react';
import Networth from './Networth.jsx';
import Assets from './Assets.jsx';
import TransactionSummary from './TransactionSummary.jsx';
import './Card.css';

function Dashboard({ networth, assets, transactions, onEditAsset, onDeleteAsset }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <Networth networth={networth} />
        </div>
        <div className="col-md-6">
          <TransactionSummary transactions={transactions} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <Assets assets={assets} onEditAsset={onEditAsset} onDeleteAsset={onDeleteAsset} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;