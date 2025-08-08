import React, { useState } from 'react';
import { formatCHF, formatSwissNumber } from '../utils/formatters';
import { buttonStyles, icons } from '../constants/styles';

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
    const Badge = ({ children }) => (
      <span className="badge bg-light text-secondary ms-2" style={buttonStyles.badge}>
        {children}
      </span>
    );

    const AssetName = () => <span style={{ fontWeight: 500 }}>{asset.name}</span>;

    switch (asset.type) {
      case 'stock':
      case 'crypto':
        return (
          <>
            <AssetName />
            {asset.quantity && <Badge>(x{asset.quantity})</Badge>}
          </>
        );
      case 'bankAccount':
        return (
          <>
            <AssetName />
            <Badge>{asset.account_type}</Badge>
            <Badge>{asset.currency}</Badge>
          </>
        );
      case 'card':
        return (
          <>
            <AssetName />
            <Badge>Limit: {formatSwissNumber(asset.card_limit)}</Badge>
          </>
        );
      case 'preciousMetal':
        return (
          <>
            <AssetName />
            {asset.quantity && <Badge>({asset.quantity}g)</Badge>}
          </>
        );
      case 'salary':
        return (
          <>
            <AssetName />
            <Badge>Monthly</Badge>
          </>
        );
      default:
        return <AssetName />;
    }
  };


  return (
    <div className="card">
      <div className="card-header">Assets</div>
      <div className="card-body">
        {assets.length === 0 ? (
          <div className="text-muted" style={{ fontStyle: 'italic' }}>No assets added yet.</div>
        ) : (
          <ul className="list-group mb-3">
            {assets.map((asset, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', background: 'transparent', padding: '14px 0' }}>
                {editIndex === index ? (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexGrow: 1 }}>
                      <span role="img" aria-label="asset" style={{ fontSize: 20, marginRight: 8 }}>{icons.asset}</span>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        style={{ width: 120, ...buttonStyles.input, marginRight: 8 }}
                      />
                      {(asset.type === "stock" || asset.type === "crypto" || asset.type === "preciousMetal") &&
                        <input
                          type="number"
                          name="quantity"
                          value={editData.quantity}
                          onChange={handleEditChange}
                          className="form-control form-control-sm"
                          style={{ width: 60, ...buttonStyles.input, marginRight: 8 }}
                          min={1}
                        />
                      }
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        name="value"
                        value={editData.value}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        style={{ width: 90, ...buttonStyles.input, marginRight: 8 }}
                        min={0}
                      />
                      <button className="btn btn-sm" style={buttonStyles.primary} onClick={() => saveEdit(index)}>
                        Save
                      </button>
                      <button className="btn btn-sm" style={buttonStyles.outline} onClick={() => setEditIndex(null)}>
                        Cancel
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="asset" style={{ fontSize: 20, marginRight: 8 }}>{icons.asset}</span>
                      {renderAssetDetails(asset)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge rounded-pill" style={{ ...buttonStyles.valueBadge, background: '#687FE5', color: '#F3E2D4' }}>
                        {formatCHF(asset.value)}
                      </span>
                      <button className="btn btn-sm" style={buttonStyles.outline} onClick={() => startEdit(index, asset)}>
                        Edit
                      </button>
                      <button className="btn btn-sm" style={buttonStyles.outline} onClick={() => onDeleteAsset(index)}>
                        Delete
                      </button>
                    </span>
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

export default Assets;