// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: {
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  } | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  pack_size?: number;
}

export interface OrderInput {
  order_number: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  shipping_address?: Order['shipping_address'];
  items: OrderItem[];
  subtotal: number;
  shipping_cost?: number;
  total: number;
  status?: OrderStatus;
  notes?: string;
}

// Analytics Types
export interface PageView {
  id: string;
  page_path: string;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  created_at: string;
}

export interface ProductView {
  id: string;
  product_id: string | null;
  visitor_id: string | null;
  created_at: string;
}

export interface CartEvent {
  id: string;
  event_type: 'add' | 'remove' | 'checkout_start' | 'checkout_complete';
  product_id: string | null;
  quantity: number | null;
  visitor_id: string | null;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  totalPageViews: number;
  totalProductViews: number;
  cartAdditions: number;
  conversionRate: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  views: number;
  orders: number;
  revenue: number;
}
