-- Add inventory and import-friendly identifiers to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS stock_count integer NOT NULL DEFAULT 0;

-- Ensure SKU uniqueness when provided (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique_idx
ON public.products (lower(sku))
WHERE sku IS NOT NULL AND btrim(sku) <> '';

-- Speeds up name conflict checks during import previews/imports
CREATE INDEX IF NOT EXISTS products_name_lower_idx
ON public.products (lower(name));
