import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShoppingCart, Package, TrendingUp, Clock, Users, ChevronDown } from "lucide-react";
import { format, subHours, subDays, subMonths, subYears } from "date-fns";

type TimePeriod = "1h" | "6h" | "24h" | "2d" | "7d" | "2w" | "30d" | "6m" | "1y";

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "1h", label: "Past 1 hour" },
  { value: "6h", label: "Past 6 hours" },
  { value: "24h", label: "Past 24 hours" },
  { value: "2d", label: "Past 2 days" },
  { value: "7d", label: "Past 7 days" },
  { value: "2w", label: "Past 2 weeks" },
  { value: "30d", label: "Past 30 days" },
  { value: "6m", label: "Past 6 months" },
  { value: "1y", label: "Past 1 year" },
];

function getStartDate(period: TimePeriod): Date {
  const now = new Date();
  switch (period) {
    case "1h":
      return subHours(now, 1);
    case "6h":
      return subHours(now, 6);
    case "24h":
      return subHours(now, 24);
    case "2d":
      return subDays(now, 2);
    case "7d":
      return subDays(now, 7);
    case "2w":
      return subDays(now, 14);
    case "30d":
      return subDays(now, 30);
    case "6m":
      return subMonths(now, 6);
    case "1y":
      return subYears(now, 1);
  }
}

interface CartEventWithProduct {
  id: string;
  event_type: string;
  product_id: string | null;
  quantity: number | null;
  visitor_id: string | null;
  created_at: string;
  product?: {
    name: string;
    brand: string;
    price: number;
    image: string | null;
  } | null;
}

interface VisitorGroup {
  visitor_id: string;
  events: CartEventWithProduct[];
  firstActivity: string;
  lastActivity: string;
  totalItems: number;
  hasCheckout: boolean;
  hasCompleted: boolean;
}

export default function AdminCarts() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("24h");
  const [viewMode, setViewMode] = useState<"timeline" | "visitors">("visitors");
  const [expandedVisitors, setExpandedVisitors] = useState<Set<string>>(new Set());

  const startDate = useMemo(() => getStartDate(timePeriod), [timePeriod]);

  const { data: cartEvents = [], isLoading } = useQuery({
    queryKey: ["admin-cart-events", timePeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_events")
        .select(`
          *,
          product:products(name, brand, price, image)
        `)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CartEventWithProduct[];
    },
  });

  // Group events by visitor
  const visitorGroups = useMemo(() => {
    const groups: Record<string, CartEventWithProduct[]> = {};
    
    cartEvents.forEach((event) => {
      const visitorId = event.visitor_id || "unknown";
      if (!groups[visitorId]) {
        groups[visitorId] = [];
      }
      groups[visitorId].push(event);
    });

    return Object.entries(groups)
      .map(([visitor_id, events]): VisitorGroup => {
        const sortedEvents = [...events].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        const addEvents = events.filter((e) => e.event_type === "add");
        const totalItems = addEvents.reduce((sum, e) => sum + (e.quantity || 1), 0);
        
        return {
          visitor_id,
          events: sortedEvents,
          firstActivity: sortedEvents[0]?.created_at || "",
          lastActivity: sortedEvents[sortedEvents.length - 1]?.created_at || "",
          totalItems,
          hasCheckout: events.some((e) => e.event_type === "checkout_start"),
          hasCompleted: events.some((e) => e.event_type === "checkout_complete"),
        };
      })
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }, [cartEvents]);

  // Calculate statistics
  const stats = useMemo(() => {
    const addEvents = cartEvents.filter((e) => e.event_type === "add");
    const removeEvents = cartEvents.filter((e) => e.event_type === "remove");
    const checkoutStarts = cartEvents.filter((e) => e.event_type === "checkout_start");
    const checkoutCompletes = cartEvents.filter((e) => e.event_type === "checkout_complete");
    
    const uniqueVisitors = new Set(cartEvents.map((e) => e.visitor_id)).size;
    const conversionRate = checkoutStarts.length > 0 
      ? (checkoutCompletes.length / checkoutStarts.length) * 100 
      : 0;

    return {
      totalAdds: addEvents.length,
      totalRemoves: removeEvents.length,
      checkoutStarts: checkoutStarts.length,
      checkoutCompletes: checkoutCompletes.length,
      uniqueVisitors,
      conversionRate,
    };
  }, [cartEvents]);

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case "add":
        return "default";
      case "remove":
        return "destructive";
      case "checkout_start":
        return "secondary";
      case "checkout_complete":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case "add":
        return "Added";
      case "remove":
        return "Removed";
      case "checkout_start":
        return "Checkout";
      case "checkout_complete":
        return "Completed";
      default:
        return eventType;
    }
  };

  const toggleVisitor = (visitorId: string) => {
    setExpandedVisitors((prev) => {
      const next = new Set(prev);
      if (next.has(visitorId)) {
        next.delete(visitorId);
      } else {
        next.add(visitorId);
      }
      return next;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cart Analytics</h1>
            <p className="text-muted-foreground">
              View cart activity and customer behavior
            </p>
          </div>
          <Select
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value as TimePeriod)}
          >
            <SelectTrigger className="w-[180px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Added</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalAdds}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Removed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalRemoves}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checkouts Started</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.checkoutStarts}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats.conversionRate.toFixed(1)}%
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {stats.checkoutCompletes} of {stats.checkoutStarts} checkouts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cart Events with Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "timeline" | "visitors")}>
              <div className="flex items-center justify-between">
                <CardTitle>Cart Events ({cartEvents.length})</CardTitle>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="visitors">By Visitor</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : cartEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No cart events found for this time period
              </div>
            ) : viewMode === "timeline" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Visitor ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(event.created_at), "MMM d, HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEventBadgeVariant(event.event_type)}>
                          {getEventLabel(event.event_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {event.product ? (
                          <div className="flex items-center gap-2">
                            {event.product.image && (
                              <img
                                src={event.product.image}
                                alt={event.product.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{event.product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {event.product.brand} • €{event.product.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{event.quantity ?? "—"}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {event.visitor_id?.slice(0, 8) ?? "—"}...
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="space-y-2">
                {visitorGroups.map((group) => (
                  <Collapsible
                    key={group.visitor_id}
                    open={expandedVisitors.has(group.visitor_id)}
                    onOpenChange={() => toggleVisitor(group.visitor_id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedVisitors.has(group.visitor_id) ? "rotate-180" : ""
                            }`}
                          />
                          <code className="text-sm bg-background px-2 py-1 rounded">
                            {group.visitor_id.slice(0, 8)}...
                          </code>
                          <div className="flex gap-2">
                            <Badge variant="outline">{group.events.length} events</Badge>
                            <Badge variant="default">{group.totalItems} items</Badge>
                            {group.hasCompleted && (
                              <Badge variant="outline" className="border-primary text-primary">
                                Completed
                              </Badge>
                            )}
                            {group.hasCheckout && !group.hasCompleted && (
                              <Badge variant="destructive">
                                Abandoned
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(group.lastActivity), "MMM d, HH:mm")}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 mt-2 border-l-2 border-muted pl-4 space-y-2">
                        {group.events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-4 py-2 text-sm"
                          >
                            <span className="text-muted-foreground whitespace-nowrap">
                              {format(new Date(event.created_at), "HH:mm:ss")}
                            </span>
                            <Badge
                              variant={getEventBadgeVariant(event.event_type)}
                              className="text-xs"
                            >
                              {getEventLabel(event.event_type)}
                            </Badge>
                            {event.product ? (
                              <span>
                                {event.product.name}{" "}
                                <span className="text-muted-foreground">
                                  ({event.quantity} × €{event.product.price.toFixed(2)})
                                </span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}