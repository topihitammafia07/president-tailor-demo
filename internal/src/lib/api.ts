import {
  Customer,
  DashboardSummary,
  Order,
  OrderStatus,
  OwnerDashboardData,
  OwnerReportData,
  PaginatedResponse,
  Payment,
  ServiceType,
  User,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private csrfInitialized = false;

  private async ensureCsrf(): Promise<void> {
    if (this.csrfInitialized) return;
    try {
      await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      this.csrfInitialized = true;
    } catch {
      // Allow request attempt even if csrf cookie pre-fetch fails
    }
  }

  private getCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      (options.method || 'GET').toUpperCase()
    );

    if (isMutation) {
      await this.ensureCsrf();
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getCsrfTokenFromCookie();
    if (token && isMutation) {
      headers['X-XSRF-TOKEN'] = token;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (res.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/login';
      }
      throw new Error('Sesi staf telah berakhir. Silakan login kembali.');
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data?.message ||
        (data?.errors ? Object.values(data.errors).flat().join(', ') : null) ||
        `Terjadi kesalahan sistem (Kode: ${res.status})`;
      const error = new Error(message) as Error & { status?: number; data?: unknown };
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data as T;
  }

  // Auth
  async login(email: string, password: string): Promise<{ message: string; user: User }> {
    this.csrfInitialized = false; // reset csrf on new login attempt
    return this.request<{ message: string; user: User }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/v1/me');
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request<DashboardSummary>('/api/v1/dashboard/summary');
  }

  // Customers
  async getCustomers(q?: string, page = 1, perPage = 15): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('page', String(page));
    if (perPage) params.set('per_page', String(perPage));
    return this.request<PaginatedResponse<Customer>>(`/api/v1/customers?${params.toString()}`);
  }

  async getCustomer(id: number | string): Promise<{ data: Customer }> {
    return this.request<{ data: Customer }>(`/api/v1/customers/${id}`);
  }

  async createCustomer(customer: {
    name: string;
    phone: string;
    address: string;
  }): Promise<{ data: Customer }> {
    return this.request<{ data: Customer }>('/api/v1/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(
    id: number | string,
    customer: Partial<{ name: string; phone: string; address: string }>
  ): Promise<{ data: Customer }> {
    return this.request<{ data: Customer }>(`/api/v1/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(customer),
    });
  }

  // Orders
  async getOrders(
    params?: { status?: string; q?: string; page?: number; per_page?: number }
  ): Promise<PaginatedResponse<Order>> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.q) query.set('q', params.q);
    if (params?.page) query.set('page', String(params.page));
    query.set('per_page', String(params?.per_page || 15));
    return this.request<PaginatedResponse<Order>>(`/api/v1/orders?${query.toString()}`);
  }

  async getOrder(id: number | string): Promise<{ data: Order }> {
    return this.request<{ data: Order }>(`/api/v1/orders/${id}`);
  }

  async createOrder(order: {
    customer_id: number;
    total_price: number;
    items: {
      service_type_id: number;
      quantity: number;
      measurements_note?: string;
    }[];
  }): Promise<{ data: Order }> {
    return this.request<{ data: Order }>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrder(
    id: number | string,
    payload: {
      total_price?: number;
      items?: {
        service_type_id: number;
        quantity: number;
        measurements_note?: string;
      }[];
    }
  ): Promise<{ data: Order }> {
    return this.request<{ data: Order }>(`/api/v1/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async updateOrderStatus(
    id: number | string,
    status: OrderStatus
  ): Promise<{ data: Order }> {
    return this.request<{ data: Order }>(`/api/v1/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Payments
  async getPayments(orderId: number | string): Promise<{ data: Payment[] }> {
    return this.request<{ data: Payment[] }>(`/api/v1/orders/${orderId}/payments`);
  }

  async createPayment(
    orderId: number | string,
    payload: {
      amount: number;
      payment_date: string;
      payment_method: string;
      notes?: string;
    }
  ): Promise<{ message: string; data: Payment; order: Order }> {
    return this.request<{ message: string; data: Payment; order: Order }>(
      `/api/v1/orders/${orderId}/payments`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  // Owner Reports & Dashboard
  async getOwnerDashboard(params?: { start_date?: string; end_date?: string }): Promise<OwnerDashboardData> {
    const query = new URLSearchParams();
    if (params?.start_date) query.set('start_date', params.start_date);
    if (params?.end_date) query.set('end_date', params.end_date);
    const qs = query.toString();
    return this.request<OwnerDashboardData>(`/api/v1/owner/dashboard${qs ? `?${qs}` : ''}`);
  }

  async getOwnerReports(params?: { start_date?: string; end_date?: string }): Promise<OwnerReportData> {
    const query = new URLSearchParams();
    if (params?.start_date) query.set('start_date', params.start_date);
    if (params?.end_date) query.set('end_date', params.end_date);
    const qs = query.toString();
    return this.request<OwnerReportData>(`/api/v1/owner/reports${qs ? `?${qs}` : ''}`);
  }

  // Service Types
  async getServiceTypes(): Promise<{ data: ServiceType[] }> {
    return this.request<{ data: ServiceType[] }>('/api/v1/service-types');
  }
}

export const api = new ApiClient();
