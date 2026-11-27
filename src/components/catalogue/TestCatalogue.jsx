import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api';
import CategoryNav, { REQUIRED_CATEGORIES } from './CategoryNav';
import CatalogueTable from './CatalogueTable';
import TestView from './TestView';
import TestEdit from './TestEdit';
import Breadcrumbs from './Breadcrumbs';
import ReorderModal from './ReorderModal';
import './TestCatalogue.css';

// URL Parser for nested catalogue routing
const parseCataloguePath = () => {
  const pathname = window.location.pathname;
  // Match patterns:
  // /test-catalogue/:category/:testId/edit
  // /test-catalogue/:category/new
  // /test-catalogue/:category/:testId
  // /test-catalogue/:category
  // /test-catalogue
  const segments = pathname.replace(/^\/test-catalogue\/?/, '').split('/').filter(Boolean);

  if (segments.length === 0) {
    return { mode: 'list', category: 'All', testId: null };
  }

  const category = decodeURIComponent(segments[0]);

  if (segments[1] === 'new') {
    return { mode: 'new', category, testId: null };
  }

  if (segments.length >= 2) {
    const testId = decodeURIComponent(segments[1]);
    const isEdit = segments[2] === 'edit';
    return { mode: isEdit ? 'edit' : 'view', category, testId };
  }

  return { mode: 'list', category, testId: null };
};

export default function TestCatalogue() {
  const { printCatalogue } = useApp();

  // Route state
  const [route, setRoute] = useState(parseCataloguePath);
  const [notice, setNotice] = useState('');

  // Categories & Dynamic Counts
  const [categoriesData, setCategoriesData] = useState({ categories: [], totals: {} });
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Tests list state
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCategoryReorderModal, setShowCategoryReorderModal] = useState(false);

  // Synchronize route with browser history
  const navigateTo = useCallback((path) => {
    window.history.pushState({}, '', path);
    setRoute(parseCataloguePath());
  }, []);

  // Listen to popstate for browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseCataloguePath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch categories & dynamic counts
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await api.getCatalogueCategories();
      setCategoriesData(data || { categories: [], totals: {} });
      setCategoriesLoading(false);
    } catch {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch tests for current category and filters
  const fetchTests = useCallback(async () => {
    if (route.mode !== 'list') return;

    try {
      setTestsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (testTypeFilter !== 'all') params.testType = testTypeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.getCatalogueTests(route.category, params);
      setTests(Array.isArray(res) ? res : (res?.tests || []));
      if (res?.pagination) {
        setPagination(res.pagination);
      } else {
        setPagination({
          page: currentPage,
          limit: pageSize,
          total: Array.isArray(res) ? res.length : 0,
          pages: 1,
        });
      }
      setTestsLoading(false);
    } catch {
      setTestsLoading(false);
    }
  }, [route.mode, route.category, currentPage, pageSize, searchQuery, testTypeFilter, statusFilter]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Reset pagination when category, search or filters change
  const handleCategorySelect = (cat) => {
    setCurrentPage(1);
    setSearchQuery('');
    setTestTypeFilter('all');
    setStatusFilter('all');
    navigateTo(`/test-catalogue/${encodeURIComponent(cat)}`);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Move test up / down within category (Level 2 Reordering)
  const handleMoveTest = async (index, delta) => {
    if (route.category === 'All') return;
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= tests.length) return;

    const nextTests = [...tests];
    const temp = nextTests[index];
    nextTests[index] = nextTests[targetIndex];
    nextTests[targetIndex] = temp;

    setTests(nextTests);

    try {
      const orderedIds = nextTests.map((t) => t.id || t._id);
      await api.reorderCategoryTests(route.category, orderedIds);
      setNotice('Test order updated successfully.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice(err.message || 'Failed to update test order.');
      fetchTests();
    }
  };

  // Save category reordering (Level 1 Reordering)
  const handleSaveCategoryOrder = async (orderedCategoryNames) => {
    await api.reorderCatalogueCategories(orderedCategoryNames);
    await fetchCategories();
    setNotice('Category order updated successfully.');
    setTimeout(() => setNotice(''), 3000);
  };

  // Delete test
  const handleDeleteTest = async (test) => {
    const testName = test.name || 'this test';
    if (!window.confirm(`Are you sure you want to remove "${testName}" from the catalogue?`)) {
      return;
    }

    try {
      await api.deleteCatalogueTest(test.id || test._id);
      setNotice(`"${testName}" has been removed from catalogue.`);
      setTimeout(() => setNotice(''), 3000);
      fetchCategories();
      fetchTests();
    } catch (err) {
      alert(err.message || 'Failed to remove test');
    }
  };

  // Build Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const list = [
      { label: 'Test Catalogue', path: '/test-catalogue' },
    ];

    if (route.category && route.category !== 'All') {
      list.push({
        label: route.category,
        path: `/test-catalogue/${encodeURIComponent(route.category)}`,
      });
    }

    if (route.mode === 'new') {
      list.push({ label: 'New Test', path: '' });
    } else if (route.mode === 'view' || route.mode === 'edit') {
      const currentTest = tests.find((t) => String(t.id || t._id) === String(route.testId));
      const testName = currentTest?.name || 'Test Details';
      list.push({
        label: testName,
        path: `/test-catalogue/${encodeURIComponent(route.category)}/${encodeURIComponent(route.testId)}`,
      });
      if (route.mode === 'edit') {
        list.push({ label: 'Edit', path: '' });
      }
    }

    return list;
  }, [route, tests]);

  return (
    <div className="catalogue-container page-container">
      {/* Top Header */}
      <header className="page-head catalogue-page-head">
        <div>
          <span className="eyebrow">TEST CATALOGUE</span>
          <p className="page-head-subtext">
            LabSmart-style nested test catalogue management with 3-level ordering, parameters &amp; rates.
          </p>
        </div>
        <div className="catalogue-page-head-actions">
          {printCatalogue && (
            <button type="button" className="secondary" onClick={printCatalogue}>
              Print test availability / Save PDF
            </button>
          )}
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumbs crumbs={breadcrumbs} onNavigate={navigateTo} />

      {/* Category Navigation Tabs (Phases 2 & 3) */}
      <CategoryNav
        categories={categoriesData.categories}
        totals={categoriesData.totals}
        selectedCategory={route.category || 'All'}
        onSelectCategory={handleCategorySelect}
        onOpenCategoryReorder={() => setShowCategoryReorderModal(true)}
      />

      {notice && <div className="catalogue-notice-banner">{notice}</div>}

      {/* Dynamic Route View Switching (Phases 3, 4, 5, 6) */}
      {route.mode === 'list' && (
        <section className="panel catalogue-main-panel">
          <CatalogueTable
            tests={tests}
            totalTests={pagination.total}
            category={route.category || 'All'}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            testTypeFilter={testTypeFilter}
            onTestTypeFilterChange={setTestTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={pagination.pages}
            loading={testsLoading}
            onViewTest={(test) =>
              navigateTo(
                `/test-catalogue/${encodeURIComponent(test.category || route.category)}/${encodeURIComponent(test.id || test._id)}`
              )
            }
            onEditTest={(test) =>
              navigateTo(
                `/test-catalogue/${encodeURIComponent(test.category || route.category)}/${encodeURIComponent(test.id || test._id)}/edit`
              )
            }
            onDeleteTest={handleDeleteTest}
            onMoveUp={(index) => handleMoveTest(index, -1)}
            onMoveDown={(index) => handleMoveTest(index, 1)}
            onAddNewTest={() =>
              navigateTo(`/test-catalogue/${encodeURIComponent(route.category === 'All' ? 'Haematology' : route.category)}/new`)
            }
          />
        </section>
      )}

      {route.mode === 'view' && route.testId && (
        <section className="panel catalogue-main-panel">
          <TestView
            testId={route.testId}
            category={route.category}
            onBack={() => navigateTo(`/test-catalogue/${encodeURIComponent(route.category)}`)}
            onEdit={() =>
              navigateTo(`/test-catalogue/${encodeURIComponent(route.category)}/${encodeURIComponent(route.testId)}/edit`)
            }
            onEditParameter={() =>
              navigateTo(`/test-catalogue/${encodeURIComponent(route.category)}/${encodeURIComponent(route.testId)}/edit`)
            }
            noticeMessage={notice}
          />
        </section>
      )}

      {(route.mode === 'edit' || route.mode === 'new') && (
        <section className="panel catalogue-main-panel">
          <TestEdit
            testId={route.testId}
            category={route.category}
            isNew={route.mode === 'new'}
            onBack={() => {
              if (route.mode === 'edit') {
                navigateTo(`/test-catalogue/${encodeURIComponent(route.category)}/${encodeURIComponent(route.testId)}`);
              } else {
                navigateTo(`/test-catalogue/${encodeURIComponent(route.category)}`);
              }
            }}
            onSaveSuccess={(savedTest, action) => {
              fetchCategories();
              setNotice(`Test "${savedTest.name}" has been ${action} successfully.`);
              setTimeout(() => setNotice(''), 3000);
              navigateTo(
                `/test-catalogue/${encodeURIComponent(savedTest.category || route.category)}/${encodeURIComponent(savedTest.id || savedTest._id)}`
              );
            }}
          />
        </section>
      )}

      {/* Category Reorder Modal (Level 1 Reordering) */}
      {showCategoryReorderModal && (
        <ReorderModal
          title="Reorder Test Categories (Level 1)"
          items={categoriesData.categories.map((c) => ({
            id: c.name,
            name: c.name,
            order: c.order,
            count: c.catalogueTestCount,
          }))}
          onClose={() => setShowCategoryReorderModal(false)}
          onSave={handleSaveCategoryOrder}
        />
      )}
    </div>
  );
}
