import React, { useState } from 'react';
import { LuX, LuArrowUp, LuArrowDown, LuGripVertical, LuSave } from 'react-icons/lu';

export default function ReorderModal({
  title = 'Reorder Items',
  items = [], // Array of { id, name, order }
  onClose,
  onSave,
}) {
  const [list, setList] = useState(() =>
    [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const move = (index, delta) => {
    const nextList = [...list];
    const target = index + delta;
    if (target < 0 || target >= nextList.length) return;

    const temp = nextList[index];
    nextList[index] = nextList[target];
    nextList[target] = temp;

    setList(nextList);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(list.map((item) => item.id || item.name));
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      setError(err.message || 'Failed to save new order');
    }
  };

  return (
    <div className="cat-modal-backdrop" onClick={onClose}>
      <div className="cat-modal-content reorder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cat-modal-header">
          <h3>{title}</h3>
          <button type="button" className="cat-modal-close" onClick={onClose}>
            <LuX />
          </button>
        </div>

        {error && <div className="catalogue-error-banner">{error}</div>}

        <p className="reorder-instructions">
          Use the up and down arrows to arrange the display order. Click Save to persist.
        </p>

        <div className="reorder-list-container">
          {list.map((item, idx) => (
            <div key={item.id || item.name || idx} className="reorder-list-item">
              <div className="reorder-item-left">
                <span className="reorder-handle">
                  <LuGripVertical />
                </span>
                <span className="reorder-badge">#{idx + 1}</span>
                <span className="reorder-item-title">{item.name}</span>
                {item.count !== undefined && (
                  <span className="reorder-item-sub">({item.count} tests)</span>
                )}
              </div>

              <div className="reorder-item-actions">
                <button
                  type="button"
                  className="order-arrow-btn"
                  disabled={idx === 0}
                  onClick={() => move(idx, -1)}
                  title="Move up"
                >
                  <LuArrowUp />
                </button>
                <button
                  type="button"
                  className="order-arrow-btn"
                  disabled={idx === list.length - 1}
                  onClick={() => move(idx, 1)}
                  title="Move down"
                >
                  <LuArrowDown />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cat-modal-actions mt-4">
          <button type="button" className="cat-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="cat-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <LuSave /> {saving ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
