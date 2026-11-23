import React, { useState, useEffect } from 'react';
import { TEST_GROUPS as FALLBACK_TEST_GROUPS } from '../../constants';
import './InvestigationPicker.css';

export default function InvestigationPicker({
  catalogue = [],
  testGroups = FALLBACK_TEST_GROUPS,
  booking = false,
  onSelectionChange,
}) {
  const [selectedGroups, setSelectedGroups] = useState(() => new Set());
  const [selectedTests, setSelectedTests] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const groupsList =
    Array.isArray(testGroups) && testGroups.length
      ? testGroups
      : FALLBACK_TEST_GROUPS;
  const groupedTestNames = new Set(
    groupsList.flatMap((group) => group.tests || [])
  );
  const standaloneTests = catalogue.filter(
    (test) => !groupedTestNames.has(test.name)
  );
  const query = search.trim().toLowerCase();
  const matches = (test) =>
    !query ||
    [test.name, test.category, test.unit]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  const displayRate = (test) => `₹${Number(test.rate || 0).toFixed(2)}`;

  const groupCatalogueTests = (group) =>
    (group.tests || [])
      .map((name) => {
        const fromCat = catalogue.find(
          (test) => test.name?.toLowerCase() === name?.toLowerCase()
        );
        if (fromCat) return fromCat;
        const fromObj = (group.testObjects || []).find(
          (t) => t.name?.toLowerCase() === name?.toLowerCase()
        );
        if (fromObj) {
          return {
            id: fromObj._id || name,
            name: fromObj.name,
            category: fromObj.category || group.category,
            unit: fromObj.unit || '',
            range: fromObj.referenceRange || '',
            rate: fromObj.rate || 0,
          };
        }
        return { name, rate: 0, unit: '', range: '' };
      })
      .filter(Boolean);

  const availableGroupTests = (group) =>
    groupCatalogueTests(group).filter(
      (test) =>
        !query ||
        group.name.toLowerCase().includes(query) ||
        (group.description &&
          group.description.toLowerCase().includes(query)) ||
        matches(test)
    );

  const toggleGroup = (group) => {
    const groupTests = groupCatalogueTests(group).map((test) => test.name);
    const isSelected = selectedGroups.has(group.id);
    setSelectedGroups((current) => {
      const next = new Set(current);
      isSelected ? next.delete(group.id) : next.add(group.id);
      return next;
    });
    setSelectedTests((current) => {
      const next = new Set(current);
      groupTests.forEach((name) =>
        isSelected ? next.delete(name) : next.add(name)
      );
      return next;
    });
  };

  const toggleTest = (name) => {
    const nextTests = new Set(selectedTests);
    nextTests.has(name) ? nextTests.delete(name) : nextTests.add(name);
    setSelectedTests(nextTests);
    setSelectedGroups((current) => {
      const next = new Set(current);
      groupsList
        .filter((group) => (group.tests || []).includes(name))
        .forEach((group) => {
          const allComponentsSelected = groupCatalogueTests(group).every(
            (test) => nextTests.has(test.name)
          );
          allComponentsSelected ? next.add(group.id) : next.delete(group.id);
        });
      return next;
    });
  };

  useEffect(() => {
    if (onSelectionChange) {
      let total = 0;
      selectedTests.forEach((testName) => {
        const found =
          catalogue.find(
            (t) => t.name?.toLowerCase() === testName?.toLowerCase()
          ) ||
          groupsList
            .flatMap((g) => g.testObjects || [])
            .find((t) => t.name?.toLowerCase() === testName?.toLowerCase());
        total += Number(found?.rate || 0);
      });
      onSelectionChange(total);
    }
  }, [selectedTests, catalogue, groupsList]);

  return (
    <div className={`investigation-picker ${booking ? 'booking-picker' : ''}`}>
      {booking && (
        <label className="test-search">
          Search tests by name or category
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tests by name or category"
          />
        </label>
      )}
      {booking && (
        <p className="test-count">
          {catalogue.length} tests available — search to narrow the list.
        </p>
      )}
      <div className="picker-scroll">
        <fieldset className="test-groups">
          <legend>Choose reportable tests</legend>
          <p className="field-help">
            Select a group to tick every component automatically, then untick
            any tests that are not required. Only checked tests will appear in
            result entry and the report.
          </p>
          <div className="group-grid">
            {groupsList.map((group) => {
              const tests = availableGroupTests(group);
              const isGroupSelected = selectedGroups.has(group.id);
              if (!tests.length) return null;
              return (
                <article
                  key={group.id}
                  className={`group-choice ${
                    isGroupSelected ? 'selected' : ''
                  }`}
                >
                  <label className="group-choice-header">
                    <input
                      type="checkbox"
                      name="testGroups"
                      value={group.id}
                      checked={isGroupSelected}
                      onChange={() => toggleGroup(group)}
                    />
                    <span>
                      <b>{group.name}</b>
                      <small>{group.description}</small>
                      <em>
                        Select all components · {tests.length} tests
                      </em>
                    </span>
                  </label>
                  <div
                    className="group-components"
                    aria-label={`${group.name} components`}
                  >
                    <span className="component-caption">
                      Untick components that are not required
                    </span>
                    <div className="component-grid">
                      {tests.map((test) => (
                        <label key={test.name} className="group-test-choice">
                          <input
                            type="checkbox"
                            name="tests"
                            value={test.name}
                            checked={selectedTests.has(test.name)}
                            onChange={() => toggleTest(test.name)}
                          />
                          <span>
                            {test.name}
                            {booking && <small>{displayRate(test)}</small>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend>Standalone individual tests</legend>
          <p className="field-help">
            These tests are not part of a listed group and remain individual
            bookings.
          </p>
          <div className="test-grid">
            {standaloneTests.filter(matches).map((test) => (
              <label key={test.name} className="test-choice">
                <input
                  type="checkbox"
                  name="tests"
                  value={test.name}
                  checked={selectedTests.has(test.name)}
                  onChange={() => toggleTest(test.name)}
                />
                <span>
                  <b>
                    {test.name}
                    {booking && <em>{displayRate(test)}</em>}
                  </b>
                  <small>
                    {test.unit || 'No unit'} · {test.range || 'Range not set'}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
