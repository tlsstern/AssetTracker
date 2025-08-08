import React, { useState } from 'react';
import { formatCHF, formatSwissNumber } from '../utils/formatters';
import { icons } from '../constants/styles';
import './Assets.css';

const Assets = ({ assets, onEditAsset, onDeleteAsset }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', value: '', quantity: '' });

  const startEdit = (index, asset) => {
    setEditIndex(index);
    setEditData({
      name: asset.name,
      value: asset.value,
      quantity: asset.quantity || 1,
      type: asset.type,
      currency: asset.currency,
      accountType: asset.account_type,
      limit: asset.card_limit,
      income: asset.income,
      metalType: asset.metal_type,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = (index) => {
    onEditAsset(index, {
      name: editData.name,
      value: parseFloat(editData.value),
      quantity: parseFloat(editData.quantity),
      type: editData.type,
      currency: editData.currency,
      account_type: editData.accountType,
      card_limit: editData.limit,
      income: editData.income,
      metal_type: editData.metalType,
    });
    setEditIndex(null);
  };


  const renderAssetDetails = (asset) => {
    const Badge = ({ children, secondary }) => (
      <span className={`asset-badge ${secondary ? 'secondary' : ''}`}>
        {children}
      </span>
    );

    switch (asset.type) {
      case 'stock':
      case 'crypto':
        return (
          <>
            <Badge>{asset.type}</Badge>
            {asset.quantity && <Badge secondary>x{asset.quantity}</Badge>}
          </>
        );
      case 'bankAccount':
        return (
          <>
            <Badge>Bank</Badge>
            <Badge secondary>{asset.account_type}</Badge>
            <Badge secondary>{asset.currency}</Badge>
          </>
        );
      case 'card':
        return (
          <>
            <Badge>Card</Badge>
            <Badge secondary>Limit: {formatSwissNumber(asset.card_limit)}</Badge>
          </>
        );
      case 'preciousMetal':
        return (
          <>
            <Badge>Metal</Badge>
            {asset.quantity && <Badge secondary>{asset.quantity}g</Badge>}
          </>
        );
      default:
        return <Badge>Asset</Badge>;
    }
  };


  return (
    <div className="assets-container">
      {assets.length === 0 ? (
        <div className="no-assets">No assets added yet.</div>
      ) : (
        <ul className="assets-list">
          {assets.map((asset, index) => (
            <li key={index} className="asset-item">
              {editIndex === index ? (
                <>
                  <div className="asset-info">
                    <span className="asset-icon">{icons.asset}</span>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="edit-input"
                      style={{ width: 150, marginRight: 8 }}
                    />
                    {(asset.type === "stock" || asset.type === "crypto" || asset.type === "preciousMetal") &&
                      <input
                        type="number"
                        name="quantity"
                        value={editData.quantity}
                        onChange={handleEditChange}
                        className="edit-input"
                        style={{ width: 80 }}
                        min={1}
                      />
                    }
                    <input
                      type="number"
                      name="value"
                      value={editData.value}
                      onChange={handleEditChange}
                      className="edit-input"
                      style={{ width: 120 }}
                      min={0}
                    />
                  </div>
                  <div className="asset-actions">
                    <button className="btn-save" onClick={() => saveEdit(index)}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={() => setEditIndex(null)}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="asset-info">
                    <span className="asset-icon">{icons.asset}</span>
                    <div className="asset-details">
                      <span className="asset-name">{asset.name}</span>
                      <div className="asset-meta">
                        {renderAssetDetails(asset)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="asset-value">
                      {formatCHF(asset.value)}
                    </span>
                    <div className="asset-actions">
                      <button className="btn-edit" onClick={() => startEdit(index, asset)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => onDeleteAsset(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Assets;