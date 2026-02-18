-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    shipping_address JSONB,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL DEFAULT 0,
    status order_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Create page_views table for traffic analytics
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    visitor_id TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create product_views table for product analytics
CREATE TABLE public.product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    visitor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cart_events table for tracking cart activity
CREATE TABLE public.cart_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'add', 'remove', 'checkout_start', 'checkout_complete'
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER,
    visitor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_events ENABLE ROW LEVEL SECURITY;

-- Orders policies - admin only
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert orders" ON public.orders
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders" ON public.orders
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Analytics tables - public insert, admin read
CREATE POLICY "Anyone can insert page views" ON public.page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view page views" ON public.page_views
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert product views" ON public.product_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view product views" ON public.product_views
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert cart events" ON public.cart_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view cart events" ON public.cart_events
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_created_at ON public.product_views(created_at);
CREATE INDEX idx_cart_events_created_at ON public.cart_events(created_at);
CREATE INDEX idx_cart_events_event_type ON public.cart_events(event_type);