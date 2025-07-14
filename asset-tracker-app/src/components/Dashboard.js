import React from 'react';
import Networth from './Networth';
import Assets from './Assets';
import TotalExpenses from './TotalExpenses';
import './Card.css';

function Dashboard({ networth, assets, expenses }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <Networth networth={networth} />
        </div>
        <div className="col-md-6">
          <TotalExpenses expenses={expenses} />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8 offset-md-2">
          <Assets assets={assets} onEditAsset={() => {}} onDeleteAsset={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
