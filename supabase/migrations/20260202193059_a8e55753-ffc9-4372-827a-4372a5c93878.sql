-- ===========================================
-- CMS TABLES: Menus, Pages, and Content Blocks
-- ===========================================

-- Menu Items Table (supports multi-level nesting)
CREATE TABLE public.menu_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    menu_location TEXT NOT NULL DEFAULT 'header', -- 'header', 'footer', etc.
    title TEXT NOT NULL,
    url TEXT, -- External URL or null if using page_id
    page_id UUID, -- Reference to dynamic page (added after pages table)
    target TEXT DEFAULT '_self', -- '_self' or '_blank'
    position INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pages Table (dynamic pages created from admin)
CREATE TABLE public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published'
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Add foreign key from menu_items to pages
ALTER TABLE public.menu_items 
ADD CONSTRAINT menu_items_page_id_fkey 
FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE SET NULL;

-- Page Blocks Table (content blocks for visual editor)
CREATE TABLE public.page_blocks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL, -- 'hero', 'text', 'image', 'cta', 'cards', 'faq', 'grid', 'spacer'
    content JSONB NOT NULL DEFAULT '{}',
    position INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_menu_items_location ON public.menu_items(menu_location);
CREATE INDEX idx_menu_items_parent ON public.menu_items(parent_id);
CREATE INDEX idx_menu_items_position ON public.menu_items(position);
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_page_blocks_page ON public.page_blocks(page_id);
CREATE INDEX idx_page_blocks_position ON public.page_blocks(position);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Menu Items RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active menu items"
ON public.menu_items FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all menu items"
ON public.menu_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert menu items"
ON public.menu_items FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update menu items"
ON public.menu_items FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete menu items"
ON public.menu_items FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Pages RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pages"
ON public.pages FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all pages"
ON public.pages FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert pages"
ON public.pages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pages"
ON public.pages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pages"
ON public.pages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page Blocks RLS
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible blocks on published pages"
ON public.page_blocks FOR SELECT
USING (
    is_visible = true 
    AND EXISTS (
        SELECT 1 FROM public.pages 
        WHERE pages.id = page_blocks.page_id 
        AND pages.status = 'published'
    )
);

CREATE POLICY "Admins can view all blocks"
ON public.page_blocks FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blocks"
ON public.page_blocks FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blocks"
ON public.page_blocks FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blocks"
ON public.page_blocks FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ===========================================
-- TRIGGERS for updated_at
-- ===========================================
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_blocks_updated_at
    BEFORE UPDATE ON public.page_blocks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();