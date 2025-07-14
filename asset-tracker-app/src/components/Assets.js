import React, { useState } from 'react';

const Assets = ({ assets, onEditAsset, onDeleteAsset }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', value: '', quantity: '' });

  const startEdit = (index, asset) => {
    setEditIndex(index);
    setEditData({
      name: asset.name,
      value: asset.value,
      quantity: asset.quantity || 1,
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
    });
    setEditIndex(null);
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="asset" style={{ fontSize: 20, marginRight: 8 }}>💰</span>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        style={{ width: 120, borderRadius: 8, border: '1px solid #e0e7ff', marginRight: 8 }}
                      />
                      <input
                        type="number"
                        name="quantity"
                        value={editData.quantity}
                        onChange={handleEditChange}
                        style={{ width: 60, borderRadius: 8, border: '1px solid #e0e7ff', marginRight: 8 }}
                        min={1}
                      />
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        name="value"
                        value={editData.value}
                        onChange={handleEditChange}
                        style={{ width: 90, borderRadius: 8, border: '1px solid #e0e7ff', marginRight: 8 }}
                        min={0}
                      />
                      <span style={{ fontWeight: 600, marginRight: 8 }}>CHF {(editData.value * editData.quantity).toFixed(2)}</span>
                      <button className="btn btn-success btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => saveEdit(index)}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => setEditIndex(null)}>
                        Cancel
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="asset" style={{ fontSize: 20, marginRight: 8 }}>💰</span>
                      <span style={{ fontWeight: 500 }}>{asset.name}</span>
                      {asset.quantity && <span className="badge bg-light text-secondary ms-2" style={{ fontWeight: 400, fontSize: 13, border: '1px solid #e0e7ff' }}>(x{asset.quantity})</span>}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge bg-primary rounded-pill" style={{ fontSize: 16, padding: '8px 16px', background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', color: '#fff', fontWeight: 600 }}>
                        CHF { (asset.value * (asset.quantity || 1)).toFixed(2) }
                      </span>
                      <button className="btn btn-outline-primary btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => startEdit(index, asset)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => onDeleteAsset(index)}>
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
