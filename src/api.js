const API_BASE = '/api/v1';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('cell-cited-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = json.message || json.error?.message || 'Request failed';
    const err = new Error(errorMsg);
    err.status = res.status;
    err.error = json.error;
    throw err;
  }
  if (json.data && typeof json.data === 'object') {
    json.data._apiMessage = json.message || 'Operation successful';
    json.data._success = json.success;
  }
  return json.data;
};

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      sessionStorage.setItem('cell-cited-token', data.token);
      sessionStorage.setItem('cell-cited-session', 'active');
      sessionStorage.setItem('cell-cited-user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  logout() {
    sessionStorage.removeItem('cell-cited-token');
    sessionStorage.removeItem('cell-cited-session');
    sessionStorage.removeItem('cell-cited-user');
  },

  async getPatients(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/patients?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createPatient(payload) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updatePatient(id, payload) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getDoctors() {
    const res = await fetch(`${API_BASE}/doctors?limit=100`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createDoctor(payload) {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateDoctor(id, payload) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getDoctorEarnings(id, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/doctors/${id}/earnings?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getTests() {
    const res = await fetch(`${API_BASE}/tests?limit=200`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createTest(payload) {
    const res = await fetch(`${API_BASE}/tests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateTest(id, payload) {
    const res = await fetch(`${API_BASE}/tests/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteTest(id) {
    const res = await fetch(`${API_BASE}/tests/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/reports?${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getReport(id) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createReport(payload) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async saveResults(reportId, items) {
    const res = await fetch(`${API_BASE}/reports/${reportId}/results`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse(res);
  },

  async finalizeReport(reportId, payload) {
    const body = Array.isArray(payload) ? { items: payload } : payload;
    const res = await fetch(`${API_BASE}/reports/${encodeURIComponent(reportId)}/finalize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async reopenReport(reportId, reason) {
    const res = await fetch(`${API_BASE}/reports/${reportId}/reopen`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  async getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/invoices${query ? `?${query}` : '?limit=100'}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async recordPayment(invoiceId, payload) {
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getBillingSummary() {
    const res = await fetch(`${API_BASE}/billing/summary`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getTestGroups() {
    const res = await fetch(`${API_BASE}/test-groups`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getLaboratory() {
    const res = await fetch(`${API_BASE}/laboratory`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateLaboratory(payload) {
    const res = await fetch(`${API_BASE}/laboratory`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
