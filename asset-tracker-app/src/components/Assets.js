import React, { useState } from 'react';
import { formatCHF, formatSwissNumber } from '../utils/formatters';
import { Icons } from './Icons';

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
      limit: asset.limit,
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
      limit: editData.limit,
      income: editData.income,
      metal_type: editData.metalType,
    });
    setEditIndex(null);
  };

  // Button styles are now handled by CSS classes

  const renderAssetDetails = (asset) => {
    switch (asset.type) {
      case 'stock':
      case 'crypto':
        return (
          <>
            <span style={{ fontWeight: 500 }}>{asset.name}</span>
            {asset.quantity && <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>(x{asset.quantity})</span>}
          </>
        )
      case 'bankAccount':
        return (
          <>
            <span style={{ fontWeight: 500 }}>{asset.name}</span>
            <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>{asset.account_type}</span>
            <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>{asset.currency}</span>
          </>
        )
      case 'card':
        return (
          <>
            <span style={{ fontWeight: 500 }}>{asset.name}</span>
            <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>Limit: {formatSwissNumber(asset.limit)}</span>
          </>
        )
      case 'preciousMetal':
        return (
          <>
            <span style={{ fontWeight: 500 }}>{asset.name}</span>
            {asset.quantity && <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>({asset.quantity}g)</span>}
          </>
        )
      case 'salary':
        return (
          <>
            <span style={{ fontWeight: 500 }}>{asset.name}</span>
            <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: 'none' }}>Monthly</span>
          </>
        )
      default:
        return <span style={{ fontWeight: 500 }}>{asset.name}</span>
    }
  }


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
                      <span style={{ marginRight: 8, color: '#667eea' }}>{Icons.wallet}</span>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="form-control form-control-sm"
                        style={{ width: 120, borderRadius: 8, border: 'none', marginRight: 8 }}
                      />
                      {(asset.type === "stock" || asset.type === "crypto" || asset.type === "preciousMetal") &&
                        <input
                          type="number"
                          name="quantity"
                          value={editData.quantity}
                          onChange={handleEditChange}
                          className="form-control form-control-sm"
                          style={{ width: 60, borderRadius: 8, border: 'none', marginRight: 8 }}
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
                        style={{ width: 90, borderRadius: 8, border: 'none', marginRight: 8 }}
                        min={0}
                      />
                      <button className="btn btn-sm btn-primary" onClick={() => saveEdit(index)}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => setEditIndex(null)}>
                        Cancel
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ marginRight: 8, color: '#667eea' }}>{Icons.wallet}</span>
                      {renderAssetDetails(asset)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge rounded-pill badge-primary">
                        {formatCHF(asset.value)}
                      </span>
                      <button className="btn btn-sm btn-outline" onClick={() => startEdit(index, asset)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => onDeleteAsset(index)}>
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