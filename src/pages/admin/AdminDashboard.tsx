import { 
  Package, DollarSign, TrendingUp, Eye, ShoppingCart, 
  Users, ArrowUpRight, ArrowDownRight, Loader2, 
  BarChart3, FileText, Clock, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { useDashboardStats, useRevenueChart, useTopPages, useOrders, useHourlyTraffic } from '@/hooks/useAnalytics';
import { Badge } from '@/components/ui/badge';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  iconBg,
  iconColor,
  isLoading 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-heading font-bold mt-1">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
        </p>
      </div>
    </div>
  );
}

function RecentOrdersTable() {
  const { data: orders = [], isLoading } = useOrders(5);
  
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-1">Orders will appear here when customers make purchases</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4">
                <p className="font-medium">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(order.created_at), 'MMM d, HH:mm')}
                </p>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm">{order.customer_name || order.customer_email}</p>
              </td>
              <td className="py-3 px-4">
                <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                  {order.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right font-medium">
                €{Number(order.total).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RevenueChart() {
  const { data: chartData, isLoading } = useRevenueChart(14);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  
  const hasData = chartData.some(d => d.revenue > 0);
  
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No revenue data yet</p>
        <p className="text-sm text-muted-foreground mt-1">Revenue will be displayed here once orders come in</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => format(parseISO(value), 'MMM d')}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `€${value}`}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip 
          formatter={(value: number) => [`€${value.toFixed(2)}`, 'Revenue']}
          labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function HourlyTrafficChart() {
  const { data: chartData, isLoading } = useHourlyTraffic();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  
  const hasData = chartData.some(d => d.views > 0);
  
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Eye className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No traffic data yet</p>
        <p className="text-sm text-muted-foreground mt-1">Hourly traffic will be displayed here</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis 
          dataKey="label" 
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          interval={2}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          allowDecimals={false}
        />
        <Tooltip 
          formatter={(value: number) => [value, 'Page Views']}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Bar 
          dataKey="views" 
          fill="url(#colorTraffic)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TopPagesCard() {
  const { data: topPages, isLoading } = useTopPages(5);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (topPages.length === 0) {
    return (
      <div className="text-center py-8">
        <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No page views yet</p>
        <p className="text-sm text-muted-foreground mt-1">Traffic data will appear here</p>
      </div>
    );
  }
  
  const maxViews = Math.max(...topPages.map(p => p.views));
  
  return (
    <div className="space-y-4">
      {topPages.map((page, index) => (
        <div key={page.path} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate max-w-[200px]" title={page.path}>
              {page.path === '/' ? 'Homepage' : page.path}
            </span>
            <span className="font-medium">{page.views}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(page.views / maxViews) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: products, isLoading: productsLoading } = useProducts(true);
  const { stats, isLoading: statsLoading } = useDashboardStats(30);

  const productStats = products ? {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.is_active).length,
  } : { totalProducts: 0, activeProducts: 0 };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>

        {/* Revenue Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`€${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Avg. Order Value"
            value={`€${stats.averageOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            isLoading={statsLoading}
          />
        </div>

        {/* Traffic & Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Page Views"
            value={stats.totalPageViews}
            icon={Eye}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Product Views"
            value={stats.totalProductViews}
            icon={Package}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Cart Additions"
            value={stats.cartAdditions}
            icon={ShoppingCart}
            iconBg="bg-pink-100"
            iconColor="text-pink-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={CheckCircle2}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            isLoading={statsLoading}
          />
        </div>

        {/* Hourly Traffic Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <h2 className="text-lg font-heading font-bold mb-4">Traffic (Last 24 Hours)</h2>
          <HourlyTrafficChart />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-heading font-bold mb-4">Revenue (Last 14 Days)</h2>
            <RevenueChart />
          </div>
          
          {/* Top Pages */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-heading font-bold mb-4">Top Pages</h2>
            <TopPagesCard />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">Recent Orders</h2>
            <Link 
              to="/admin/orders" 
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <RecentOrdersTable />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-heading font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Products</p>
                <p className="text-sm text-muted-foreground">
                  {productsLoading ? '...' : `${productStats.activeProducts} active`}
                </p>
              </div>
            </Link>

            <Link
              to="/admin/pages"
              className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Manage Pages</p>
                <p className="text-sm text-muted-foreground">CMS content</p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">View Store</p>
                <p className="text-sm text-muted-foreground">See your storefront</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
