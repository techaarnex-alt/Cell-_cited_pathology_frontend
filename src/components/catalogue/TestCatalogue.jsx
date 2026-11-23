import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './TestCatalogue.css';

export function CatalogueRow({ test, onSave, onRemove }) {
  const [draft, setDraft] = useState(test);
  useEffect(() => setDraft(test), [test]);

  const update = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));

  return (
    <tr>
      <td>
        <b>{test.name}</b>
      </td>
      <td>
        <input
          value={draft.category}
          onChange={(event) => update('category', event.target.value)}
          placeholder="Category"
        />
      </td>
      <td>
        <input
          value={draft.unit}
          onChange={(event) => update('unit', event.target.value)}
          placeholder="Unit"
        />
      </td>
      <td>
        <textarea
          value={draft.range}
          onChange={(event) => update('range', event.target.value)}
          placeholder="Reference range"
          rows="2"
        />
      </td>
      <td>
        <input
          value={draft.rate}
          onChange={(event) => update('rate', event.target.value)}
          type="number"
          min="0"
          step="0.01"
          aria-label={`${test.name} rate`}
        />
      </td>
      <td className="catalogue-actions">
        <button
          type="button"
          className="small"
          onClick={() => onSave(test.name, draft)}
        >
          Save changes
        </button>
        <button
          type="button"
          className="secondary small danger"
          onClick={() => onRemove(test.name)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

export function Catalogue({ tests, onSave, onRemove }) {
  return (
    <>
      <header>
        <div>
          <h2>Saved laboratory tests</h2>
          <p>{tests.length} tests available for booking.</p>
        </div>
      </header>
      <div className="table-scroll">
        <table className="app-table catalogue-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Category</th>
              <th>Units</th>
              <th>Reference range</th>
              <th>Rate (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <CatalogueRow
                key={test.name}
                test={test}
                onSave={onSave}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function TestCatalogue() {
  const { catalogue, addTest, saveTest, removeTest, printCatalogue } = useApp();

  return (
    <>
      <header className="page-head">
        <div>
          <span className="eyebrow">LABORATORY CONFIGURATION</span>
          <h1>Available Tests &amp; Prices</h1>
        </div>
        <button className="secondary" onClick={printCatalogue}>
          Print test availability / Save PDF
        </button>
      </header>

      <form className="panel catalogue-form" onSubmit={addTest}>
        <h2>Add laboratory test</h2>
        <div className="form-grid catalogue-add-grid">
          <label>
            Test name
            <input name="name" required />
          </label>
          <label>
            Category
            <input name="category" placeholder="e.g. Biochemistry" />
          </label>
          <label>
            Unit
            <input name="unit" placeholder="e.g. mg/dL" />
          </label>
          <label>
            Reference range
            <input name="range" placeholder="e.g. 70–100" required />
          </label>
          <label>
            Rate (₹)
            <input
              name="rate"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </label>
        </div>
        <button>Add test</button>
      </form>

      <section className="panel catalogue-panel">
        <Catalogue tests={catalogue} onSave={saveTest} onRemove={removeTest} />
      </section>
    </>
  );
}
