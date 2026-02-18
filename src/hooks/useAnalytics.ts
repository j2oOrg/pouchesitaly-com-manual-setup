import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, PageView, ProductView, CartEvent, DashboardStats, RevenueDataPoint, TopProduct, OrderItem } from '@/types/analytics';
import { subDays, format } from 'date-fns';

// Fetch orders
export function useOrders(limit?: number) {
  return useQuery({
    queryKey: ['orders', limit],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match our Order type
      return (data || []).map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || [],
        shipping_address: order.shipping_address as Order['shipping_address'],
        status: order.status as Order['status'],
      })) as Order[];
    },
  });
}

// Fetch page views for a date range
export function usePageViews(days: number = 30) {
  return useQuery({
    queryKey: ['page-views', days],
    queryFn: async () => {
      const startDate = subDays(new Date(), days).toISOString();
      
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PageView[];
    },
  });
}

// Fetch product views for a date range
export function useProductViews(days: number = 30) {
  return useQuery({
    queryKey: ['product-views', days],
    queryFn: async () => {
      const startDate = subDays(new Date(), days).toISOString();
      
      const { data, error } = await supabase
        .from('product_views')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProductView[];
    },
  });
}

// Fetch cart events for a date range
export function useCartEvents(days: number = 30) {
  return useQuery({
    queryKey: ['cart-events', days],
    queryFn: async () => {
      const startDate = subDays(new Date(), days).toISOString();
      
      const { data, error } = await supabase
        .from('cart_events')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CartEvent[];
    },
  });
}

// Calculate dashboard stats
export function useDashboardStats(days: number = 30) {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: pageViews = [], isLoading: pageViewsLoading } = usePageViews(days);
  const { data: productViews = [], isLoading: productViewsLoading } = useProductViews(days);
  const { data: cartEvents = [], isLoading: cartEventsLoading } = useCartEvents(days);
  
  const isLoading = ordersLoading || pageViewsLoading || productViewsLoading || cartEventsLoading;
  
  const startDate = subDays(new Date(), days);
  
  // Filter orders to the date range
  const recentOrders = orders.filter(o => new Date(o.created_at) >= startDate);
  const completedOrders = recentOrders.filter(o => 
    o.status !== 'cancelled' && o.status !== 'refunded'
  );
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = recentOrders.length;
  const pendingOrders = recentOrders.filter(o => o.status === 'pending').length;
  const averageOrderValue = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;
  
  const totalPageViews = pageViews.length;
  const totalProductViews = productViews.length;
  const cartAdditions = cartEvents.filter(e => e.event_type === 'add').length;
  const checkoutCompletes = cartEvents.filter(e => e.event_type === 'checkout_complete').length;
  
  // Conversion rate: checkouts completed / unique visitors who added to cart
  const uniqueCartVisitors = new Set(cartEvents.filter(e => e.event_type === 'add').map(e => e.visitor_id)).size;
  const conversionRate = uniqueCartVisitors > 0 
    ? (checkoutCompletes / uniqueCartVisitors) * 100 
    : 0;
  
  const stats: DashboardStats = {
    totalRevenue,
    totalOrders,
    pendingOrders,
    averageOrderValue,
    totalPageViews,
    totalProductViews,
    cartAdditions,
    conversionRate,
  };
  
  return { stats, isLoading };
}

// Revenue over time chart data
export function useRevenueChart(days: number = 30) {
  const { data: orders = [], isLoading } = useOrders();
  
  const chartData: RevenueDataPoint[] = [];
  const startDate = subDays(new Date(), days);
  
  // Create a map for each day
  for (let i = 0; i <= days; i++) {
    const date = subDays(new Date(), days - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    chartData.push({ date: dateStr, revenue: 0, orders: 0 });
  }
  
  // Fill in the data
  orders.forEach(order => {
    if (new Date(order.created_at) >= startDate) {
      const dateStr = format(new Date(order.created_at), 'yyyy-MM-dd');
      const point = chartData.find(p => p.date === dateStr);
      if (point && order.status !== 'cancelled' && order.status !== 'refunded') {
        point.revenue += Number(order.total);
        point.orders += 1;
      }
    }
  });
  
  return { data: chartData, isLoading };
}

// Top products by views
export function useTopProducts(limit: number = 5) {
  const { data: productViews = [], isLoading: viewsLoading } = useProductViews(30);
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  
  const isLoading = viewsLoading || ordersLoading;
  
  // Count views per product
  const viewCounts: Record<string, number> = {};
  productViews.forEach(pv => {
    if (pv.product_id) {
      viewCounts[pv.product_id] = (viewCounts[pv.product_id] || 0) + 1;
    }
  });
  
  // Count orders and revenue per product
  const orderCounts: Record<string, { orders: number; revenue: number; name: string }> = {};
  orders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (item.product_id) {
          if (!orderCounts[item.product_id]) {
            orderCounts[item.product_id] = { orders: 0, revenue: 0, name: item.product_name || 'Unknown' };
          }
          orderCounts[item.product_id].orders += item.quantity || 1;
          orderCounts[item.product_id].revenue += (item.price || 0) * (item.quantity || 1);
        }
      });
    }
  });
  
  // Combine and sort
  const allProductIds = new Set([...Object.keys(viewCounts), ...Object.keys(orderCounts)]);
  const topProducts: TopProduct[] = Array.from(allProductIds).map(id => ({
    product_id: id,
    product_name: orderCounts[id]?.name || 'Unknown Product',
    views: viewCounts[id] || 0,
    orders: orderCounts[id]?.orders || 0,
    revenue: orderCounts[id]?.revenue || 0,
  }));
  
  // Sort by views
  topProducts.sort((a, b) => b.views - a.views);
  
  return { data: topProducts.slice(0, limit), isLoading };
}

// Page views by path
export function useTopPages(limit: number = 10) {
  const { data: pageViews = [], isLoading } = usePageViews(30);
  
  const pathCounts: Record<string, number> = {};
  pageViews.forEach(pv => {
    pathCounts[pv.page_path] = (pathCounts[pv.page_path] || 0) + 1;
  });
  
  const topPages = Object.entries(pathCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
  
  return { data: topPages, isLoading };
}

// Hourly traffic chart (last 24 hours)
export interface HourlyTrafficPoint {
  hour: string;
  views: number;
  label: string;
}

export function useHourlyTraffic() {
  const { data: pageViews = [], isLoading } = usePageViews(1); // Last 1 day
  
  const chartData: HourlyTrafficPoint[] = [];
  const now = new Date();
  
  // Create slots for the last 24 hours
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(now.getHours() - i, 0, 0, 0);
    const hourStr = format(hour, 'yyyy-MM-dd HH:00');
    const label = format(hour, 'HH:mm');
    chartData.push({ hour: hourStr, views: 0, label });
  }
  
  // Fill in the data
  pageViews.forEach(pv => {
    const pvDate = new Date(pv.created_at);
    const hourStr = format(pvDate, 'yyyy-MM-dd HH:00');
    const point = chartData.find(p => p.hour === hourStr);
    if (point) {
      point.views += 1;
    }
  });
  
  return { data: chartData, isLoading };
}
