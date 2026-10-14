export interface User {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'staff';
}

export interface ServiceType {
  id: number;
  slug: string;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  orders_count?: number;
  orders?: Order[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  service_type_id: number;
  service_type?: ServiceType;
  quantity: number;
  measurements_note: string | null;
}

export type OrderStatus = 'baru' | 'diproses' | 'selesai';
export type PaymentStatus = 'belum_dibayar' | 'sebagian' | 'lunas';
export type PaymentMethod = 'tunai' | 'transfer_bank' | 'qris';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes?: string | null;
  created_by?: number | null;
  created_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name_snapshot: string;
  customer_address_snapshot: string;
  status: OrderStatus;
  total_price: number;
  total_paid?: number;
  remaining_bill?: number;
  payment_status?: PaymentStatus;
  customer?: Customer;
  items?: OrderItem[];
  payments?: Payment[];
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  counts: {
    total: number;
    baru: number;
    diproses: number;
    selesai: number;
    belum_lunas?: number;
  };
  recent_orders: Order[];
}

export interface MonthlyTrend {
  month: string;
  label: string;
  order_count: number;
  order_value: number;
  payment_collected: number;
}

export interface DailyTrend {
  date: string;
  label: string;
  order_count: number;
  order_value: number;
  payment_collected: number;
}

export interface OwnerDashboardData {
  metrics: {
    total_orders: number;
    orders_baru: number;
    orders_diproses: number;
    orders_selesai: number;
    total_order_value: number;
    total_revenue_collected: number;
    total_outstanding_receivables: number;
  };
  monthly_trends: MonthlyTrend[];
  top_unpaid_orders?: UnpaidOrderSummary[];
  filter: {
    start_date?: string | null;
    end_date?: string | null;
  };
}

export interface ServiceBreakdownItem {
  id: number;
  slug: string;
  name: string;
  item_count: number;
  order_count: number;
}

export interface UnpaidOrderSummary {
  id: number;
  order_number: string;
  customer_name: string;
  created_at?: string;
  total_price: number;
  total_paid: number;
  remaining_bill: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
}

export interface OwnerReportData {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_orders: number;
    total_order_value: number;
    payments_collected: number;
    total_outstanding_receivables: number;
  };
  service_breakdown: ServiceBreakdownItem[];
  payment_status_breakdown: {
    lunas: number;
    sebagian: number;
    belum_dibayar: number;
  };
  daily_trends: DailyTrend[];
  monthly_trends: MonthlyTrend[];
  unpaid_orders: UnpaidOrderSummary[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
