import React, { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../../api';
import './CategoryInvestigationPicker.css';

export default function CategoryInvestigationPicker({
  catalogue = [],
  testGroups = [],
  onSelectionChange,
}) {
  // Test groups and tests loaded 100% dynamically via API (NO localStorage, NO cookies, NO static files)
  const [testGroupsList, setTestGroupsList] = useState(() =>
    Array.isArray(testGroups) && testGroups.length ? testGroups : []
  );
  const [testsLookupMap, setTestsLookupMap] = useState(new Map());
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch test groups and tests directly from backend API endpoints
  useEffect(() => {
    let isMounted = true;
    setLoadingGroups(true);

    Promise.all([
      api.getTestGroups().catch((err) => {
        console.warn('Error fetching /api/v1/test-groups:', err);
        return [];
      }),
      api.getTests({ limit: 1500 }).catch((err) => {
        console.warn('Error fetching /api/v1/tests:', err);
        return [];
      }),
    ])
      .then(([groupsData, testsData]) => {
        if (!isMounted) return;

        if (Array.isArray(groupsData) && groupsData.length > 0) {
          setTestGroupsList(groupsData);
          if (!activeCategory) {
            setActiveCategory(groupsData[0].name);
          }
        }

        // Build lookup map for individual test records by lowercase name
        const map = new Map();
        const testItems = Array.isArray(testsData)
          ? testsData
          : testsData?.tests || testsData?.data || [];
        if (Array.isArray(testItems)) {
          testItems.forEach((t) => {
            const name = (t.name || t.investigation || '').trim().toLowerCase();
            if (name) map.set(name, t);
          });
        }
        setTestsLookupMap(map);
      })
      .finally(() => {
        if (isMounted) setLoadingGroups(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure an active category is selected once groups are loaded
  useEffect(() => {
    if (!activeCategory && testGroupsList.length > 0) {
      setActiveCategory(testGroupsList[0].name);
    }
  }, [testGroupsList, activeCategory]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find active group object from API data
  const activeGroup = useMemo(() => {
    if (!activeCategory) return null;
    return testGroupsList.find(
      (g) => (g.name || '').toLowerCase() === activeCategory.toLowerCase()
    );
  }, [testGroupsList, activeCategory]);

  // Extract all tests for the active category directly from API response
  const activeGroupTests = useMemo(() => {
    if (!activeGroup) return [];

    const tests = [];
    const seen = new Set();

    // 1. From activeGroup.tests (nested tests array from /api/v1/test-groups)
    if (Array.isArray(activeGroup.tests)) {
      activeGroup.tests.forEach((t) => {
        if (!t) return;
        const name = typeof t === 'string' ? t : t.name || t.investigation;
        // Skip invalid/unnamed tests (e.g. order 31 where name is null)
        if (!name || typeof name !== 'string' || !name.trim()) return;

        const lower = name.trim().toLowerCase();
        if (seen.has(lower)) return;
        seen.add(lower);

        let rate = 0;
        if (typeof t === 'object') {
          // Priority A: Check parameters array (e.g. Hemoglobin: parameters[0].rate = 500)
          if (Array.isArray(t.parameters) && t.parameters.length > 0) {
            const paramWithRate = t.parameters.find(
              (p) => p && p.rate !== undefined && p.rate !== null && Number(p.rate) > 0
            );
            if (paramWithRate) {
              rate = Number(paramWithRate.rate);
            } else if (t.parameters[0]?.rate !== undefined && t.parameters[0]?.rate !== null) {
              rate = Number(t.parameters[0].rate);
            }
          }

          // Priority B: Check root rate
          if (!rate && t.rate !== undefined && t.rate !== null && Number(t.rate) > 0) {
            rate = Number(t.rate);
          }

          // Priority C: Check pricing object
          if (!rate && t.pricing) {
            if (t.pricing.mrp && Number(t.pricing.mrp) > 0) {
              rate = Number(t.pricing.mrp);
            } else if (t.pricing.net && Number(t.pricing.net) > 0) {
              rate = Number(t.pricing.net);
            }
          }

          // Priority D: Check tests collection lookup from /api/v1/tests
          if (!rate && testsLookupMap.has(lower)) {
            const matched = testsLookupMap.get(lower);
            if (matched.rate !== undefined && Number(matched.rate) > 0) {
              rate = Number(matched.rate);
            } else if (matched.pricing?.mrp && Number(matched.pricing.mrp) > 0) {
              rate = Number(matched.pricing.mrp);
            }
          }

          // Priority E: Check catalogue prop if present
          if (!rate && Array.isArray(catalogue)) {
            const fromCat = catalogue.find(
              (c) => (c.name || c.investigation || '').trim().toLowerCase() === lower
            );
            if (fromCat && fromCat.rate && Number(fromCat.rate) > 0) {
              rate = Number(fromCat.rate);
            }
          }
        }

        tests.push({
          id: typeof t === 'object' ? t.id || t._id || lower : lower,
          name: name.trim(),
          category: activeGroup.name,
          rate,
          unit:
            (typeof t === 'object' && t.unit) ||
            (t.parameters && t.parameters[0]?.unit) ||
            '',
          range:
            (typeof t === 'object' && (t.range || t.referenceRange)) ||
            (t.parameters && t.parameters[0]?.referenceRange) ||
            '',
        });
      });
    }

    // 2. From activeGroup.panels if present
    if (Array.isArray(activeGroup.panels)) {
      activeGroup.panels.forEach((p) => {
        if (!p || !p.name) return;
        const lower = p.name.trim().toLowerCase();
        if (seen.has(lower)) return;
        seen.add(lower);
        let rate = p.rate !== undefined && p.rate !== null ? Number(p.rate) : 0;
        if (!rate && testsLookupMap.has(lower)) {
          const match = testsLookupMap.get(lower);
          if (match?.rate) rate = Number(match.rate);
        }
        tests.push({
          id: p.id || p._id || lower,
          name: p.name.trim(),
          category: activeGroup.name,
          rate,
        });
      });
    }

    // 3. Fallback from activeGroup.testNames if tests array was not populated
    if (!tests.length && Array.isArray(activeGroup.testNames)) {
      activeGroup.testNames.forEach((rawName) => {
        if (!rawName || typeof rawName !== 'string' || !rawName.trim()) return;
        const lower = rawName.trim().toLowerCase();
        if (seen.has(lower)) return;
        seen.add(lower);
        let rate = 0;
        if (testsLookupMap.has(lower)) {
          const match = testsLookupMap.get(lower);
          if (match?.rate) rate = Number(match.rate);
        }
        tests.push({
          id: lower,
          name: rawName.trim(),
          category: activeGroup.name,
          rate,
        });
      });
    }

    // Sort alphabetically so tests appear in natural A-Z order
    tests.sort((a, b) => a.name.localeCompare(b.name));
    return tests;
  }, [activeGroup, catalogue, testsLookupMap]);

  // Filter tests inside active category by search input
  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return activeGroupTests;
    const q = searchQuery.toLowerCase().trim();
    return activeGroupTests.filter((t) => t.name.toLowerCase().includes(q));
  }, [activeGroupTests, searchQuery]);

  // Click on category button: selects the group, does NOT open dropdown yet
  const handleCategoryClick = (groupName) => {
    setActiveCategory(groupName);
    setSearchQuery('');
  };

  // Toggle selection of a test
  const handleToggleTest = (test) => {
    const isAlreadySelected = selectedTests.some(
      (t) => t.name.toLowerCase() === test.name.toLowerCase()
    );

    let next;
    if (isAlreadySelected) {
      next = selectedTests.filter(
        (t) => t.name.toLowerCase() !== test.name.toLowerCase()
      );
    } else {
      next = [...selectedTests, test];
    }

    setSelectedTests(next);
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (onSelectionChange) {
      const total = next.reduce((sum, t) => sum + Number(t.rate || 0), 0);
      onSelectionChange(total);
    }
  };

  const handleRemoveTest = (testName) => {
    const next = selectedTests.filter(
      (t) => t.name.toLowerCase() !== testName.toLowerCase()
    );
    setSelectedTests(next);

    if (onSelectionChange) {
      const total = next.reduce((sum, t) => sum + Number(t.rate || 0), 0);
      onSelectionChange(total);
    }
  };

  return (
    <div
      className={`category-investigation-picker-container ${
        isFocused ? 'is-dropdown-open' : ''
      }`}
    >
      {/* 1. Category Buttons Fetched 100% Dynamically from /api/v1/test-groups */}
      <div className="category-pills-grid" role="tablist">
        {loadingGroups && testGroupsList.length === 0 ? (
          <span className="categories-loading-hint">Loading test groups from API...</span>
        ) : (
          testGroupsList.map((group) => {
            const groupName = group.name;
            const validTests = Array.isArray(group.tests)
              ? group.tests.filter(
                  (t) =>
                    t &&
                    (typeof t === 'string'
                      ? t.trim()
                      : t.name && typeof t.name === 'string' && t.name.trim())
                )
              : Array.isArray(group.testNames)
              ? group.testNames.filter(Boolean)
              : [];
            const count = validTests.length;
            const isActive =
              (activeCategory || '').toLowerCase() === groupName.toLowerCase();

            return (
              <button
                key={group._id || group.id || groupName}
                type="button"
                className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleCategoryClick(groupName)}
                title={`${groupName} (${count} tests)`}
              >
                <span className="category-pill-name">{groupName}</span>
                {count > 0 && <span className="category-pill-count">{count}</span>}
              </button>
            );
          })
        )}
      </div>

      {/* 2. Lab Investigations Input Box & Focus-triggered Dropdown */}
      <div
        className={`lab-investigations-field-wrapper ${isFocused ? 'is-open' : ''}`}
        ref={containerRef}
      >
        <label className="lab-investigations-label">Lab Investigations</label>

        <div
          className={`lab-investigations-input-box ${isFocused ? 'is-focused' : ''}`}
          onClick={() => {
            setIsFocused(true);
            inputRef.current?.focus();
            setTimeout(() => {
              containerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              });
            }, 80);
          }}
        >
          {/* Selected Test Chips inside the box */}
          {selectedTests.map((test) => (
            <span key={test.name} className="selected-test-chip">
              <span className="chip-name">{test.name}</span>
              <span className="chip-rate">(Rs.{test.rate})</span>
              <button
                type="button"
                className="chip-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTest(test.name);
                }}
                title={`Remove ${test.name}`}
              >
                ✕
              </button>
            </span>
          ))}

          {/* Search / focus input */}
          <input
            ref={inputRef}
            type="text"
            className="lab-investigations-search-input"
            placeholder={
              selectedTests.length === 0
                ? activeCategory
                  ? `Click here to choose ${activeCategory} tests...`
                  : 'Click here to choose investigations...'
                : `Add another test from ${activeCategory}...`
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>

        {/* Dynamic Dropdown: Opens ONLY when user clicks inside the box */}
        {isFocused && activeCategory && (
          <div className="investigations-dropdown-menu">
            <div className="dropdown-category-header">
              <span>{activeCategory} Investigations ({activeGroupTests.length} tests)</span>
              <button
                type="button"
                className="dropdown-close-btn"
                onClick={() => setIsFocused(false)}
                title="Close dropdown"
              >
                ✕ Close
              </button>
            </div>

            <div className="dropdown-items-scroll">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const isSelected = selectedTests.some(
                    (t) => t.name.toLowerCase() === test.name.toLowerCase()
                  );

                  return (
                    <div
                      key={test.id || test.name}
                      className={`dropdown-test-item ${isSelected ? 'is-selected' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur before selection
                        handleToggleTest(test);
                      }}
                    >
                      <span className="test-item-title">
                        {test.name} (Rs.{test.rate})
                      </span>
                      {isSelected && <span className="test-item-check">✓</span>}
                    </div>
                  );
                })
              ) : (
                <div className="dropdown-empty-item">
                  No tests found in {activeCategory} matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden inputs to submit selected tests, categories, and rates with the form */}
      {selectedTests.map((t) => (
        <React.Fragment key={t.name}>
          <input type="hidden" name="tests" value={t.name} />
          {t.category && (
            <input type="hidden" name="testGroups" value={t.category} />
          )}
          <input type="hidden" name="testRates" value={t.rate || 0} />
        </React.Fragment>
      ))}
      <input
        type="hidden"
        name="fee"
        value={selectedTests.reduce((sum, t) => sum + Number(t.rate || 0), 0)}
      />
      <input
        type="hidden"
        name="feeOverride"
        value={selectedTests.reduce((sum, t) => sum + Number(t.rate || 0), 0)}
      />
    </div>
  );
}
