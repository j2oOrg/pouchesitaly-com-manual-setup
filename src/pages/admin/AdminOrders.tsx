import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeftRight, ExternalLink, Eye, RefreshCw, Search, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type RawOrder = Database['public']['Tables']['orders']['Row'];

type SortMode = 'newest' | 'oldest' | 'totalHigh' | 'totalLow';
type StatusFilter = OrderStatus | 'all';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

type NormalizedOrderItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  pack_size?: number;
};

type NormalizedOrder = {
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
  items: NormalizedOrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
};

type KustomMetadata = {
  processor: string;
  kustomOrderId: string | null;
  kustomOrderToken: string | null;
  kustomStatus: string | null;
  lastPollAt: string | null;
};

const statusLabel = (status: OrderStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const formatCurrency = (value: number) => `€${Number(value).toFixed(2)}`;

const parseJson = <T,>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
};

const normalizeShippingAddress = (value: unknown): NormalizedOrder['shipping_address'] => {
  const parsed = parseJson<Record<string, unknown>>(value, {});
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  return {
    address:
      typeof parsed.street_address === 'string'
        ? parsed.street_address
        : typeof parsed.address === 'string'
          ? parsed.address
          : undefined,
    city: typeof parsed.city === 'string' ? parsed.city : undefined,
    postal_code:
      typeof parsed.postal_code === 'string'
        ? parsed.postal_code
        : typeof parsed.postalCode === 'string'
          ? parsed.postalCode
          : undefined,
    country: typeof parsed.country === 'string' ? parsed.country : undefined,
  };
};

const normalizeItems = (value: unknown): NormalizedOrderItem[] => {
  const parsed = parseJson<unknown[]>(value, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => {
      const productId =
        typeof item.product_id === 'string'
          ? item.product_id
          : typeof item.id === 'string'
            ? item.id
            : 'unknown';

      const productName =
        typeof item.product_name === 'string'
          ? item.product_name
          : typeof item.name === 'string'
            ? item.name
            : 'Product';

      const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
      const price = typeof item.price === 'number' ? item.price : Number(item.price || 0);
      const packSize =
        typeof item.pack_size === 'number' ? item.pack_size : typeof item.packSize === 'number' ? item.packSize : undefined;

      return {
        product_id: productId,
        product_name: productName,
        quantity,
        price: Number.isFinite(price) ? price : 0,
        ...(typeof packSize === 'number' ? { pack_size: packSize } : {}),
      };
    });
};

const normalizeOrder = (order: RawOrder): NormalizedOrder => ({
  ...order,
  items: normalizeItems(order.items),
  shipping_address: normalizeShippingAddress(order.shipping_address),
  status: order.status as OrderStatus,
});

const getKustomMetadata = (notes: string | null): KustomMetadata => {
  const parsed = parseJson<Record<string, unknown>>(notes, {});

  return {
    processor:
      typeof parsed.processor === 'string'
        ? parsed.processor
        : 'kustom-playground',
    kustomOrderId:
      typeof parsed.kustom_order_id === 'string' && parsed.kustom_order_id
        ? parsed.kustom_order_id
        : null,
    kustomOrderToken:
      typeof parsed.kustom_order_token === 'string' && parsed.kustom_order_token
        ? parsed.kustom_order_token
        : null,
    kustomStatus:
      typeof parsed.kustom_status === 'string' && parsed.kustom_status
        ? parsed.kustom_status
        : null,
    lastPollAt:
      typeof parsed.kustom_last_poll_at === 'string' && parsed.kustom_last_poll_at
        ? parsed.kustom_last_poll_at
        : null,
  };
};

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<NormalizedOrder | null>(null);
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [pendingDeleteOrderId, setPendingDeleteOrderId] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, sortMode]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-orders', statusFilter, searchTerm, sortMode, page, pageSize],
    queryFn: async () => {
      const sortField = sortMode === 'totalHigh' || sortMode === 'totalLow' ? 'total' : 'created_at';
      const ascending = sortMode === 'oldest' || sortMode === 'totalLow';

      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm.trim()) {
        const term = `%${searchTerm.trim()}%`;
        query = query.or(`order_number.ilike.${term},customer_email.ilike.${term},customer_name.ilike.${term}`);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);

      const { data: rows, count, error } = await query;
      if (error) throw error;

      return {
        orders: (rows || []).map(normalizeOrder),
        total: count || 0,
      };
    },
  });

  const orders = useMemo(() => data?.orders || [], [data]);
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showingFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ order, status }: { order: NormalizedOrder; status: OrderStatus }) => {
      const payload: Record<string, unknown> = { status };

      if (status === 'shipped') {
        payload.shipped_at = new Date().toISOString();
        payload.delivered_at = null;
      } else if (status === 'delivered') {
        payload.shipped_at = order.shipped_at || new Date().toISOString();
        payload.delivered_at = new Date().toISOString();
      } else {
        payload.shipped_at = null;
        payload.delivered_at = null;
      }

      const { error } = await supabase.from('orders').update(payload).eq('id', order.id);
      if (error) throw error;

      return { orderId: order.id, status };
    },
    onMutate: ({ order }) => setActionOrderId(order.id),
    onSuccess: ({ orderId, status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
      toast({ title: 'Order updated', description: 'Order status updated successfully.' });
    },
    onError: (err) => {
      toast({
        title: 'Failed to update order',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => setActionOrderId(null),
  });

  const syncWithKustomMutation = useMutation({
    mutationFn: async (order: NormalizedOrder) => {
      const metadata = getKustomMetadata(order.notes);
      if (!metadata.kustomOrderId) {
        throw new Error('No Kustom order reference found on this order.');
      }

      const { data, error } = await supabase.functions.invoke('kustom-checkout', {
        body: {
          operation: 'mark_paid',
          order_id: order.id,
          kustom_order_id: metadata.kustomOrderId,
          kustom_order_token: metadata.kustomOrderToken,
        },
      });

      if (error) throw error;

      const payload = data as { success?: boolean; data?: { status?: string }; error?: string };
      if (payload?.success === false) {
        throw new Error(payload.error || 'Kustom sync failed.');
      }

      return payload?.data?.status || null;
    },
    onMutate: (order) => setActionOrderId(order.id),
    onSuccess: (remoteStatus, order) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (
        selectedOrder?.id === order.id &&
        remoteStatus &&
        ORDER_STATUSES.includes(remoteStatus as OrderStatus)
      ) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: remoteStatus as OrderStatus } : null
        );
      }
      toast({ title: 'Kustom synced', description: 'Order payment status refreshed.' });
    },
    onError: (err) => {
      toast({
        title: 'Kustom sync failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => setActionOrderId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      return orderId;
    },
    onMutate: (orderId) => setActionOrderId(orderId),
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      setPendingDeleteOrderId(null);
      toast({ title: 'Order deleted', description: 'Order removed successfully.' });
    },
    onError: (err) => {
      toast({
        title: 'Failed to delete order',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    },
    onSettled: () => setActionOrderId(null),
  });

  const isRowBusy = (orderId: string) => actionOrderId === orderId;

  const selectedMetadata = selectedOrder ? getKustomMetadata(selectedOrder.notes) : null;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage all Kustom-powered checkout orders and keep payment statuses in sync.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number, email or customer name"
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="w-44 h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
                <SelectTrigger className="w-48 h-11">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="totalHigh">Total high → low</SelectItem>
                  <SelectItem value="totalLow">Total low → high</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="h-11" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm text-muted-foreground flex items-center justify-between">
            <span>
              Showing {showingFrom}-{showingTo} of {total}
            </span>
            <span>Page {page} / {totalPages}</span>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-10 text-center">
                <AlertCircle className="w-6 h-6 mx-auto text-primary animate-spin" />
              </div>
            ) : isError ? (
              <div className="p-8 text-destructive">
                {(error as Error)?.message || 'Failed to load orders'}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-muted-foreground text-center">No orders found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const meta = getKustomMetadata(order.notes);
                    const isBusy = isRowBusy(order.id);

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(order.created_at), 'MMM d, yyyy HH:mm')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{order.customer_name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            disabled={isBusy}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({
                                order,
                                status: value as OrderStatus,
                              })
                            }
                          >
                            <SelectTrigger className="w-36">
                              <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-700'}>
                                {statusLabel(order.status)}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {statusLabel(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <p className="text-sm capitalize">
                            {meta.processor}
                            {meta.kustomStatus ? ` (${meta.kustomStatus})` : ''}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              disabled={isBusy}
                              className="h-9"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncWithKustomMutation.mutate(order)}
                              disabled={isBusy || !meta.kustomOrderId}
                              className="h-9"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Kustom
                            </Button>
                            <AlertDialog
                              open={pendingDeleteOrderId === order.id}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setPendingDeleteOrderId(null);
                                }
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isBusy}
                                  className="h-9"
                                  onClick={() => setPendingDeleteOrderId(order.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action permanently deletes order {order.order_number}. You cannot undo this.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(order.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1}
          >
            <ArrowLeftRight className="w-4 h-4 mr-2 rotate-180" />
            Previous
          </Button>

          <p>
            Page {page} of {totalPages}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page >= totalPages}
          >
            Next
            <ArrowLeftRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {selectedOrder ? `Order ${selectedOrder.order_number}` : 'Order details'}
            </DialogTitle>
            <DialogDescription>
              Update status and inspect customer, shipping and item details.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-4">
                  <h3 className="font-heading font-medium mb-3">Customer</h3>
                  <p className="font-medium">{selectedOrder.customer_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone ? (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                  ) : null}
                  {selectedOrder.shipping_address ? (
                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      <p>{selectedOrder.shipping_address.address || '-'}</p>
                      <p>
                        {[selectedOrder.shipping_address.city, selectedOrder.shipping_address.postal_code]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                      <p>{selectedOrder.shipping_address.country || '-'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-3">No shipping address stored.</p>
                  )}
                </div>

                <div className="rounded-xl border border-border p-4">
                  <h3 className="font-heading font-medium mb-3">Payment</h3>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Subtotal:</span> {formatCurrency(selectedOrder.subtotal)}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Shipping:</span> {formatCurrency(selectedOrder.shipping_cost)}
                  </p>
                  <p className="text-sm font-medium">
                    <span className="text-muted-foreground">Total:</span> {formatCurrency(selectedOrder.total)}
                  </p>
                  <div className="mt-2">
                    <Badge className={statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-700'}>
                      {statusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {format(parseISO(selectedOrder.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated: {format(parseISO(selectedOrder.updated_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h3 className="font-heading font-medium mb-3">Order status controls</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({
                        order: selectedOrder,
                        status: value as OrderStatus,
                      })
                    }
                    disabled={isRowBusy(selectedOrder.id)}
                  >
                    <SelectTrigger className="w-full sm:w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => syncWithKustomMutation.mutate(selectedOrder)}
                    disabled={isRowBusy(selectedOrder.id) || !selectedMetadata?.kustomOrderId}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync from Kustom
                  </Button>

                  {selectedMetadata?.kustomOrderId ? (
                    <Button asChild variant="outline">
                      <a
                        href={`https://api.playground.kustom.co/checkout/v3/orders/${selectedMetadata.kustomOrderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Kustom
                      </a>
                    </Button>
                  ) : null}
                </div>

                {selectedMetadata ? (
                  <div className="mt-3 text-xs text-muted-foreground space-y-1">
                    <p>Processor: {selectedMetadata.processor}</p>
                    <p>Remote status: {selectedMetadata.kustomStatus || 'not synced'}</p>
                    <p>
                      Last synced:{' '}
                      {selectedMetadata.lastPollAt
                        ? format(parseISO(selectedMetadata.lastPollAt), 'MMM d, yyyy HH:mm')
                        : 'Never'}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <h3 className="font-heading font-medium p-4 pb-2">Order items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Pack</TableHead>
                      <TableHead>Unit price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.pack_size || '-'}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this order</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action permanently deletes order {selectedOrder.order_number}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(selectedOrder.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
